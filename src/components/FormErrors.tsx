import { HiExclamationCircle } from 'react-icons/hi'

interface FormValidationIssue {
  path?: string[] // path might not always be present for general errors
  message: string
  code?: string
  expected?: string
  received?: string
}

interface FormErrorsProps {
  issues: FormValidationIssue[] | null
  title?: string
}

const FormErrors = ({
  issues,
  title = 'Please correct the following errors:'
}: FormErrorsProps) => {
  if (!issues || issues.length === 0) {
    return null
  }

  return (
    <div className="m-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-md text-sm">
      <div className="flex">
        <div className="flex-shrink-0">
          <HiExclamationCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h4 className="font-semibold text-red-800">{title}</h4>
          <ul className="list-disc list-inside mt-1 text-red-700 space-y-1">
            {issues.map((issue, index) => (
              <li key={index}>
                {issue.path && issue.path.length > 0 ? (
                  <strong>{`${issue.path.join('.')} - `}</strong>
                ) : (
                  ''
                )}
                {issue.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default FormErrors
