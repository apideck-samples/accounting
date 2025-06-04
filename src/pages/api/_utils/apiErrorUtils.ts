import * as ApideckErrors from '@apideck/unify/models/errors'
import { VercelResponse } from '@vercel/node'

interface ErrorDetails {
  statusCode: number
  message: string
  detail?: any
}

export function handleApiError(
  res: VercelResponse,
  error: unknown,
  contextMessage = 'An error occurred'
): void {
  console.error(`[API Error - ${contextMessage}]:`, error)

  let response: ErrorDetails = {
    statusCode: 500,
    message: contextMessage,
    detail:
      error instanceof Error
        ? { name: error.name, message: error.message }
        : { error: String(error) }
  }

  if (error instanceof ApideckErrors.BadRequestResponse) {
    response = {
      statusCode: error.data$?.statusCode || 400,
      message: error.data$?.message || 'Bad Request',
      detail: error.data$ || error
    }
  } else if (error instanceof ApideckErrors.UnauthorizedResponse) {
    response = {
      statusCode: error.data$?.statusCode || 401,
      message: error.data$?.message || 'Unauthorized',
      detail: error.data$ || error
    }
  } else if (error instanceof ApideckErrors.PaymentRequiredResponse) {
    response = {
      statusCode: error.data$?.statusCode || 402,
      message: error.data$?.message || 'Payment Required',
      detail: error.data$ || error
    }
  } else if (error instanceof ApideckErrors.NotFoundResponse) {
    response = {
      statusCode: error.data$?.statusCode || 404,
      message: error.data$?.message || 'Not Found',
      detail: error.data$ || error
    }
  } else if (error instanceof ApideckErrors.UnprocessableResponse) {
    response = {
      statusCode: error.data$?.statusCode || 422,
      message: error.data$?.message || 'Unprocessable Entity',
      detail: error.data$ || error
    }
  } else if (error instanceof ApideckErrors.SDKValidationError) {
    let validationIssues: any[] | undefined
    const cause = (error as any).cause // Access cause dynamically
    if (cause && typeof cause === 'object' && Array.isArray(cause.issues)) {
      validationIssues = cause.issues
    }

    response = {
      statusCode: 400,
      message: error.message || 'Input validation failed',
      detail: {
        name: error.name,
        issues: validationIssues,
        rawMessage: (error as any).rawMessage || undefined,
        rawValue: (error as any).rawValue || undefined,
        cause: validationIssues ? undefined : cause
      }
    }
  } else if (error instanceof ApideckErrors.APIError) {
    response = {
      statusCode: (error as any)?.statusCode || 500,
      message: (error as any)?.message || error.message || 'API Error',
      detail: error
    }
  } else if ((error as any)?.statusCode) {
    response = {
      statusCode: (error as any).statusCode,
      message: (error as any).message || contextMessage,
      detail: error
    }
  }

  res.status(response.statusCode).json({ message: response.message, detail: response.detail })
}
