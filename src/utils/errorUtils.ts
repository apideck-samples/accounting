export interface FormValidationIssue {
  path?: string[]
  message: string
}

export interface ParsedApiError {
  toastTitle: string
  toastDescription: string
  formIssues: FormValidationIssue[]
}

// Tries to normalize a path string like "Lines[0].TaxCode.UID" to an array like ["invoice", "lineItems", "0", "taxCode", "uid"]
// or a simpler path like "object.field" to ["object", "field"]
function normalizePath(
  pathStr: string | undefined,
  resourceName = 'resource'
): string[] | undefined {
  if (!pathStr || typeof pathStr !== 'string' || !pathStr.includes('.') || pathStr.includes(' ')) {
    // Only treat as path if it contains dots and no spaces (simple heuristic)
    return undefined
  }
  return (
    pathStr
      .toLowerCase()
      // Normalize MYOB Lines[0].TaxCode.UID to resourceName.lineItems[0].taxCode.id
      .replace(/^lines\[(\d+)\]\.(.+)\.uid$/, `${resourceName}.lineItems.$1.$2.id`)
      .replace(/^lines\[(\d+)\]\.(.+)$/, `${resourceName}.lineItems.$1.$2`)
      .replace(/^elements\[(\d+)\]\./, `${resourceName}.elements.$1.`)
      .replace(/^request\.body\./, `${resourceName}.`)
      .split('.')
  )
}

interface ExtractedInfo {
  message: string | null
  path?: string[]
  isSpecificConnectorError: boolean
}

function extractMostSpecificError(data: any, depth = 0): ExtractedInfo {
  if (!data || typeof data !== 'object' || depth > 7) {
    return { message: null, isSpecificConnectorError: false }
  }

  // Priority 1: Xero's ValidationException Elements array
  if (Array.isArray(data.Elements) && data.Elements.length > 0) {
    const firstElement = data.Elements[0]
    if (firstElement) {
      // Deeper nest for some validation types
      if (
        firstElement.ValidationErrors &&
        Array.isArray(firstElement.ValidationErrors) &&
        firstElement.ValidationErrors.length > 0 &&
        typeof firstElement.ValidationErrors[0].Message === 'string'
      ) {
        return { message: firstElement.ValidationErrors[0].Message, isSpecificConnectorError: true }
      }
      // Direct message on the element
      if (typeof firstElement.Message === 'string') {
        return { message: firstElement.Message, isSpecificConnectorError: true }
      }
    }
  }

  // Priority 2: MYOB Connector's "Errors" array
  if (Array.isArray(data.Errors) && data.Errors.length > 0) {
    const firstMyobError = data.Errors[0]
    if (firstMyobError && typeof firstMyobError === 'object') {
      const msg =
        typeof firstMyobError.AdditionalDetails === 'string' &&
        firstMyobError.AdditionalDetails.trim() !== ''
          ? firstMyobError.AdditionalDetails
          : typeof firstMyobError.Message === 'string'
          ? firstMyobError.Message.trim()
          : null
      if (msg) {
        const pathStr =
          typeof firstMyobError.AdditionalDetails === 'string' &&
          firstMyobError.AdditionalDetails.includes('.') &&
          !firstMyobError.AdditionalDetails.includes(' ')
            ? firstMyobError.AdditionalDetails
            : undefined
        return {
          message: msg,
          path: normalizePath(pathStr, 'resource'),
          isSpecificConnectorError: true
        }
      }
    }
  }

  // Priority 3: Xero general error with ErrorNumber (but not if it's a ValidationException, already handled)
  if (
    typeof data.Message === 'string' &&
    data.ErrorNumber &&
    data.Type &&
    data.Type !== 'ValidationException'
  ) {
    return { message: data.Message, isSpecificConnectorError: true }
  }

  // Priority 4: Standard 'message' property if specific enough
  const messageProp = data.message || data.Message
  if (typeof messageProp === 'string') {
    const lowerMsg = messageProp.toLowerCase()
    const genericWrappers = [
      'connector',
      'unknown',
      'occurred',
      'failed to process',
      'internal server',
      'validation exception',
      'bad request'
    ]
    if (!genericWrappers.some((wrapper) => lowerMsg.includes(wrapper))) {
      return { message: messageProp, isSpecificConnectorError: false }
    }
  }

  // Priority 5: Recursively check common nested structures
  const potentialNestedPaths = ['error', 'detail', 'errors', 'issues']
  for (const pathKey of potentialNestedPaths) {
    if (data[pathKey]) {
      const nestedData = data[pathKey]
      const deeperResult = extractMostSpecificError(
        Array.isArray(nestedData) ? nestedData[0] : nestedData,
        depth + 1
      )
      if (deeperResult.message) return deeperResult
    }
  }

  // Fallback 6: Any top-level message if all else fails
  if (typeof data.message === 'string')
    return { message: data.message, isSpecificConnectorError: false }
  if (typeof data.Message === 'string')
    return { message: data.Message, isSpecificConnectorError: false }

  return { message: null, isSpecificConnectorError: false }
}

export function parseApiResponseError(
  apiError: any,
  defaultOperationTitle = 'Operation Failed',
  resourceName = 'resource'
): ParsedApiError {
  let toastTitle = defaultOperationTitle
  let toastDescription = 'An unexpected error occurred. Please check the form or try again.'
  let formIssues: FormValidationIssue[] = []

  if (!apiError || typeof apiError !== 'object') {
    const message = typeof apiError === 'string' ? apiError : defaultOperationTitle
    return {
      toastTitle: defaultOperationTitle,
      toastDescription: message,
      formIssues: [{ message }]
    }
  }

  const extracted = extractMostSpecificError(apiError)
  const bestUserFacingMessage =
    extracted.message ||
    (typeof apiError.message === 'string' ? apiError.message : defaultOperationTitle)
  toastDescription = bestUserFacingMessage

  // Determine Toast Title
  if (
    apiError.message &&
    apiError.message !== bestUserFacingMessage &&
    !bestUserFacingMessage.includes(apiError.message) &&
    apiError.message.length < 70
  ) {
    toastTitle = apiError.message
  } else if (apiError.detail?.typeName && apiError.detail.typeName !== bestUserFacingMessage) {
    toastTitle = apiError.detail.typeName
  } else if (apiError.detail?.name && apiError.detail.name !== bestUserFacingMessage) {
    toastTitle = apiError.detail.name
  } else if (
    bestUserFacingMessage.length < 70 &&
    bestUserFacingMessage !== defaultOperationTitle &&
    bestUserFacingMessage !== apiError.message
  ) {
    toastTitle = bestUserFacingMessage
    if (
      apiError.message &&
      apiError.message !== toastTitle &&
      toastTitle !== defaultOperationTitle
    ) {
      toastDescription = `${apiError.message}: ${bestUserFacingMessage}`
    } else if (apiError.message && apiError.message !== toastTitle) {
      toastDescription = apiError.message
    }
  }

  const errorDetailFromApiHandler = apiError.detail

  if (errorDetailFromApiHandler) {
    // Case 1: SDKValidationError (client-side or from handleApiError)
    if (
      errorDetailFromApiHandler.name === 'SDKValidationError' &&
      Array.isArray(errorDetailFromApiHandler.issues) &&
      errorDetailFromApiHandler.issues.length > 0
    ) {
      formIssues = errorDetailFromApiHandler.issues.map((issue: any) => ({
        path: normalizePath(issue.path?.join('.'), resourceName),
        message: extractMostSpecificError(issue).message || issue.message || 'Validation issue'
      }))
      if (errorDetailFromApiHandler.message && errorDetailFromApiHandler.message !== toastTitle)
        toastTitle = errorDetailFromApiHandler.message
      if (
        formIssues.length > 0 &&
        formIssues[0].message &&
        formIssues[0].message !== toastDescription
      )
        toastDescription = formIssues[0].message
    }
    // Case 2: RequestValidationError (server-side from Apideck gateway/connector)
    else if (
      errorDetailFromApiHandler.typeName === 'RequestValidationError' &&
      errorDetailFromApiHandler.detail?.errors &&
      Array.isArray(errorDetailFromApiHandler.detail.errors)
    ) {
      formIssues = errorDetailFromApiHandler.detail.errors.map((err: any) => ({
        path: normalizePath(err.path, resourceName),
        message: extractMostSpecificError(err).message || err.message || 'API validation issue'
      }))
      if (errorDetailFromApiHandler.message && errorDetailFromApiHandler.message !== toastTitle)
        toastTitle = errorDetailFromApiHandler.message
      if (
        formIssues.length > 0 &&
        formIssues[0].message &&
        formIssues[0].message !== toastDescription
      )
        toastDescription = formIssues[0].message
    }
    // Case 3: MYOB specific Errors array (this structure comes from apiError.detail.error.Errors via handleApiError)
    else if (
      errorDetailFromApiHandler.error?.Errors &&
      Array.isArray(errorDetailFromApiHandler.error.Errors) &&
      errorDetailFromApiHandler.error.Errors.length > 0
    ) {
      formIssues = errorDetailFromApiHandler.error.Errors.map((myobError: any) => ({
        path: normalizePath(myobError.AdditionalDetails, resourceName),
        message: myobError.AdditionalDetails || myobError.Message || 'Connector validation error'
      }))
      if (apiError.message && !toastTitle.toLowerCase().includes('connector'))
        toastTitle = apiError.message
      if (
        formIssues.length > 0 &&
        formIssues[0].message &&
        formIssues[0].message !== toastDescription
      )
        toastDescription = formIssues[0].message
    }
  }

  // If after specific type parsing, formIssues is still empty, but our top-level extraction found a message (and possibly a path), use that.
  if (formIssues.length === 0 && extracted.message) {
    // Ensure we don't add a duplicate if bestUserFacingMessage was already the most specific.
    if (!formIssues.some((fi) => fi.message === extracted.message)) {
      formIssues.push({ message: extracted.message, path: extracted.path })
    }
  }

  // Final fallback if formIssues is still empty.
  if (formIssues.length === 0) {
    const fallbackMessage = bestUserFacingMessage || apiError.message || defaultOperationTitle // Use bestUserFacingMessage here too
    if (!formIssues.some((fi) => fi.message === fallbackMessage)) {
      formIssues.push({ message: fallbackMessage })
    }
    if (toastDescription === 'An unexpected error occurred. Please check the form or try again.')
      toastDescription = fallbackMessage
  }

  // Refine title and description to avoid redundancy with formIssues if formIssues has the most specific info.
  if (
    formIssues.length > 0 &&
    formIssues[0].message &&
    formIssues[0].message !== toastDescription &&
    formIssues[0].message !== toastTitle
  ) {
    // If form issue is very specific, toast description can be a bit more general or same as title.
    if (toastTitle.toLowerCase().includes('connector') || toastTitle === defaultOperationTitle) {
      toastDescription = formIssues[0].message
    } else if (!toastDescription.includes(formIssues[0].message)) {
      toastDescription = `${toastTitle}: ${formIssues[0].message}`.substring(0, 150)
    }
  } else if (
    formIssues.length > 0 &&
    formIssues[0].message &&
    toastTitle === toastDescription &&
    toastTitle.length > 70
  ) {
    toastTitle = defaultOperationTitle
  }
  if (
    toastTitle === defaultOperationTitle &&
    apiError.message &&
    apiError.message !== toastDescription &&
    apiError.message !== defaultOperationTitle
  ) {
    toastTitle = apiError.message
  }

  return { toastTitle, toastDescription, formIssues }
}
