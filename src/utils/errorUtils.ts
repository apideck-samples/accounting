export interface FormValidationIssue {
  path?: string[]
  message: string
}

export interface ParsedApiError {
  toastTitle: string
  toastDescription: string
  formIssues: FormValidationIssue[]
}

// Helper to recursively find the most specific error message string
function findMeaningfulMessage(data: any, depth = 0): string | null {
  if (!data || depth > 7) {
    return null
  }

  // Priority: Xero-specific deeply nested error message format
  if (typeof data.Message === 'string' && data.ErrorNumber) {
    return data.Message
  }
  if (
    Array.isArray(data.Elements) &&
    data.Elements.length > 0 &&
    data.Elements[0].ValidationErrors &&
    Array.isArray(data.Elements[0].ValidationErrors) &&
    data.Elements[0].ValidationErrors.length > 0 &&
    typeof data.Elements[0].ValidationErrors[0].Message === 'string'
  ) {
    return data.Elements[0].ValidationErrors[0].Message
  }

  // General message properties
  if (typeof data.message === 'string') {
    // Avoid overly generic messages if we can go deeper
    if (
      data.message.toLowerCase().includes('connector returned error') ||
      data.message.toLowerCase().includes('unknown error')
    ) {
      // Prefer to go deeper if possible
    } else {
      return data.message
    }
  }
  if (typeof data.Message === 'string') {
    return data.Message
  }

  // Recursively check nested standard error structures
  if (data.detail && typeof data.detail === 'object') {
    const msg = findMeaningfulMessage(data.detail, depth + 1)
    if (msg) return msg
  }
  if (data.error && typeof data.error === 'object') {
    const msg = findMeaningfulMessage(data.error, depth + 1)
    if (msg) return msg
  }
  if (
    data.errors &&
    Array.isArray(data.errors) &&
    data.errors.length > 0 &&
    typeof data.errors[0] === 'object'
  ) {
    const msg = findMeaningfulMessage(data.errors[0], depth + 1)
    if (msg) return msg
  } else if (
    data.errors &&
    Array.isArray(data.errors) &&
    data.errors.length > 0 &&
    typeof data.errors[0] === 'string'
  ) {
    return data.errors[0]
  }
  if (
    data.issues &&
    Array.isArray(data.issues) &&
    data.issues.length > 0 &&
    typeof data.issues[0] === 'object'
  ) {
    const msg = findMeaningfulMessage(data.issues[0], depth + 1)
    if (msg) return msg
  } else if (
    data.issues &&
    Array.isArray(data.issues) &&
    data.issues.length > 0 &&
    typeof data.issues[0] === 'string'
  ) {
    return data.issues[0]
  }

  // Fallback to a generic message if it was skipped earlier due to being too generic but nothing deeper was found
  if (typeof data.message === 'string') return data.message

  return null
}

export function parseApiResponseError(
  apiError: any,
  defaultErrorMessage = 'An error occurred'
): ParsedApiError {
  let toastTitle = defaultErrorMessage
  let toastDescription = 'Please check the details or try again.'
  let formIssues: FormValidationIssue[] = []

  if (!apiError || typeof apiError !== 'object') {
    const message = typeof apiError === 'string' ? apiError : defaultErrorMessage
    return {
      toastTitle: defaultErrorMessage,
      toastDescription: message,
      formIssues: [{ message }]
    }
  }

  // Extract the most specific message available for user display
  const deepestMessage = findMeaningfulMessage(apiError)
  if (deepestMessage) {
    toastDescription = deepestMessage
  }

  // Determine a contextual toast title
  if (apiError.message && apiError.message !== deepestMessage) {
    toastTitle = apiError.message
  } else if (apiError.detail?.typeName) {
    toastTitle = apiError.detail.typeName
  } else if (apiError.detail?.name) {
    toastTitle = apiError.detail.name
  } else if (deepestMessage && deepestMessage.length < 60) {
    toastTitle = deepestMessage
    if (apiError.message && apiError.message !== toastTitle) toastDescription = apiError.message
  } else {
    toastTitle = defaultErrorMessage
  }

  const errorDetail = apiError.detail

  if (errorDetail) {
    // Case 1: SDKValidationError (from handleApiError, which gets it from SDK)
    if (
      errorDetail.name === 'SDKValidationError' &&
      Array.isArray(errorDetail.issues) &&
      errorDetail.issues.length > 0
    ) {
      formIssues = errorDetail.issues.map((issue: any) => ({
        path: issue.path,
        message: findMeaningfulMessage(issue) || issue.message || 'Validation issue'
      }))
    }
    // Case 2: RequestValidationError (from handleApiError, which gets it from SDK parsing API response)
    else if (
      errorDetail.typeName === 'RequestValidationError' &&
      errorDetail.detail?.errors &&
      Array.isArray(errorDetail.detail.errors)
    ) {
      formIssues = errorDetail.detail.errors.map((err: any) => ({
        path: err.path ? err.path.replace(/^request\.body\./, 'expense.').split('.') : undefined,
        message: findMeaningfulMessage(err) || err.message || 'API validation issue'
      }))
    }
  }

  // If after specific parsing, formIssues is empty, use the best message found as a general form issue.
  if (formIssues.length === 0 && deepestMessage) {
    formIssues.push({ message: deepestMessage })
  }

  // If formIssues still empty and toastDescription is just default, but apiError.message exists
  if (
    formIssues.length === 0 &&
    toastDescription === 'Please check the details or try again.' &&
    apiError.message
  ) {
    formIssues.push({ message: apiError.message })
  }

  // Ensure a fallback if everything else fails
  if (formIssues.length === 0 && toastDescription === 'Please check the details or try again.') {
    toastDescription = defaultErrorMessage
    formIssues.push({ message: defaultErrorMessage })
  }

  return { toastTitle, toastDescription, formIssues }
}
