import { BalanceSheetReport } from './tool-renderers/BalanceSheetReport'
import { CreditNoteResults } from './tool-renderers/CreditNoteResults'
import { CustomerResults } from './tool-renderers/CustomerResults'
import { ExpenseResults } from './tool-renderers/ExpenseResults'
import { GenericResult } from './tool-renderers/GenericResult'
import { InvoiceResults } from './tool-renderers/InvoiceResults'
import { PurchaseOrderResults } from './tool-renderers/PurchaseOrderResults'
import { EmptyResult, NoData, ToolError, ToolLoading } from './tool-renderers/ToolStates'

export function ToolResultRenderer({ toolInvocation }: { toolInvocation: any }) {
  const { toolName, result, state } = toolInvocation

  if (state === 'call' || state === 'partial-call' || !result) {
    return <ToolLoading toolName={toolName} />
  }

  if (result?.error) {
    return <ToolError error={result.error} />
  }

  const isListTool = toolName.startsWith('list') || toolName.includes('list')

  if (state === 'result' && !Array.isArray(result) && isListTool) {
    return <NoData />
  }

  if (state === 'result' && Array.isArray(result) && result.length === 0) {
    return <EmptyResult toolName={toolName} />
  }

  switch (toolName) {
    case 'listCustomers':
      return <CustomerResults result={result} />
    case 'listInvoices':
      return <InvoiceResults result={result} />
    case 'listExpenses':
      return <ExpenseResults result={result} />
    case 'listCreditNotes':
      return <CreditNoteResults result={result} />
    case 'listPurchaseOrders':
      return <PurchaseOrderResults result={result} />
    case 'getBalanceSheet':
      return <BalanceSheetReport result={result} />
    default:
      return <GenericResult toolName={toolName} result={result} />
  }
}
