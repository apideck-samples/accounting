import { tool } from 'ai'
import { init } from 'pages/api/_utils/apideck'
import { z } from 'zod'

export interface ToolContext {
  jwt: string
  serviceId: string
}

export function createAccountingTools({ jwt, serviceId }: ToolContext) {
  const listCustomers = tool({
    description: 'Get a list of customers from the accounting software',
    parameters: z.object({
      limit: z.number().optional().describe('Number of customers to return (default: 10)')
    }),
    execute: async ({ limit = 10 }) => {
      console.log(`[Tool] Fetching ${limit} customers...`)

      try {
        const apideck = init(jwt)
        const response = await apideck.accounting.customers.list({
          limit,
          serviceId
        })

        let customers: any[] = []
        for await (const page of response) {
          customers = page.getCustomersResponse?.data || []
          break
        }

        console.log(`[Tool] Found ${customers.length} customers`)
        return customers.slice(0, limit)
      } catch (error) {
        console.error('[Tool] Error fetching customers:', error)
        return { error: 'Failed to fetch customers' }
      }
    }
  })

  const listInvoices = tool({
    description: 'Get a list of invoices from the accounting software',
    parameters: z.object({
      limit: z.number().optional().describe('Number of invoices to return (default: 10)')
    }),
    execute: async ({ limit = 10 }) => {
      console.log(`[Tool] Fetching ${limit} invoices...`)

      try {
        const apideck = init(jwt)
        const response = await apideck.accounting.invoices.list({
          limit,
          serviceId
        })

        let invoices: any[] = []
        for await (const page of response) {
          invoices = page.getInvoicesResponse?.data || []
          break
        }

        console.log(`[Tool] Found ${invoices.length} invoices`)
        return invoices.slice(0, limit)
      } catch (error) {
        console.error('[Tool] Error fetching invoices:', error)
        return { error: 'Failed to fetch invoices' }
      }
    }
  })

  const listExpenses = tool({
    description: 'Get a list of expenses from the accounting software',
    parameters: z.object({
      limit: z.number().optional().describe('Number of expenses to return (default: 10)')
    }),
    execute: async ({ limit = 10 }) => {
      console.log(`[Tool] Fetching ${limit} expenses...`)

      try {
        const apideck = init(jwt)
        const response = await apideck.accounting.expenses.list({
          limit,
          serviceId
        })

        let expenses: any[] = []
        for await (const page of response) {
          expenses = page.getExpensesResponse?.data || []
          break
        }

        console.log(`[Tool] Found ${expenses.length} expenses`)
        return expenses.slice(0, limit)
      } catch (error) {
        console.error('[Tool] Error fetching expenses:', error)
        return { error: 'Failed to fetch expenses' }
      }
    }
  })

  const getProfitAndLoss = tool({
    description: 'Get profit and loss report from the accounting software',
    parameters: z.object({
      startDate: z.string().optional().describe('Start date in YYYY-MM-DD format'),
      endDate: z.string().optional().describe('End date in YYYY-MM-DD format')
    }),
    execute: async ({ startDate, endDate }) => {
      console.log(`[Tool] Fetching profit and loss report...`)

      try {
        const apideck = init(jwt)
        const response = await apideck.accounting.profitAndLoss.get({
          serviceId,
          filter: {
            startDate,
            endDate
          }
        })

        console.log(`[Tool] Retrieved profit and loss report`)
        return response.getProfitAndLossResponse?.data
      } catch (error) {
        console.error('[Tool] Error fetching profit and loss:', error)
        return { error: 'Failed to fetch profit and loss report' }
      }
    }
  })

  const listCreditNotes = tool({
    description: 'Get a list of credit notes from the accounting software',
    parameters: z.object({
      limit: z.number().optional().describe('Number of credit notes to return (default: 10)')
    }),
    execute: async ({ limit = 10 }) => {
      console.log(`[Tool] Fetching ${limit} credit notes...`)

      try {
        const apideck = init(jwt)
        const response = await apideck.accounting.creditNotes.list({
          limit,
          serviceId
        })

        let creditNotes: any[] = []
        for await (const page of response) {
          creditNotes = page.getCreditNotesResponse?.data || []
          break
        }

        console.log(`[Tool] Found ${creditNotes.length} credit notes`)
        return creditNotes.slice(0, limit)
      } catch (error) {
        console.error('[Tool] Error fetching credit notes:', error)
        return { error: 'Failed to fetch credit notes' }
      }
    }
  })

  const listPayments = tool({
    description: 'Get a list of payments from the accounting software',
    parameters: z.object({
      limit: z.number().optional().describe('Number of payments to return (default: 10)')
    }),
    execute: async ({ limit = 10 }) => {
      console.log(`[Tool] Fetching ${limit} payments...`)

      try {
        const apideck = init(jwt)
        const response = await apideck.accounting.payments.list({
          limit,
          serviceId
        })

        let payments: any[] = []
        for await (const page of response) {
          payments = page.getPaymentsResponse?.data || []
          break
        }

        console.log(`[Tool] Found ${payments.length} payments`)
        return payments.slice(0, limit)
      } catch (error) {
        console.error('[Tool] Error fetching payments:', error)
        return { error: 'Failed to fetch payments' }
      }
    }
  })

  const listPurchaseOrders = tool({
    description: 'Get a list of purchase orders from the accounting software',
    parameters: z.object({
      limit: z.number().optional().describe('Number of purchase orders to return (default: 10)')
    }),
    execute: async ({ limit = 10 }) => {
      console.log(`[Tool] Fetching ${limit} purchase orders...`)

      try {
        const apideck = init(jwt)
        const response = await apideck.accounting.purchaseOrders.list({
          limit,
          serviceId
        })

        let purchaseOrders: any[] = []
        for await (const page of response) {
          purchaseOrders = page.getPurchaseOrdersResponse?.data || []
          break
        }

        console.log(`[Tool] Found ${purchaseOrders.length} purchase orders`)
        return purchaseOrders.slice(0, limit)
      } catch (error) {
        console.error('[Tool] Error fetching purchase orders:', error)
        return { error: 'Failed to fetch purchase orders' }
      }
    }
  })

  const listSuppliers = tool({
    description: 'Get a list of suppliers from the accounting software',
    parameters: z.object({
      limit: z.number().optional().describe('Number of suppliers to return (default: 10)')
    }),
    execute: async ({ limit = 10 }) => {
      console.log(`[Tool] Fetching ${limit} suppliers...`)

      try {
        const apideck = init(jwt)
        const response = await apideck.accounting.suppliers.list({
          limit,
          serviceId
        })

        let suppliers: any[] = []
        for await (const page of response) {
          suppliers = page.getSuppliersResponse?.data || []
          break
        }

        console.log(`[Tool] Found ${suppliers.length} suppliers`)
        return suppliers.slice(0, limit)
      } catch (error) {
        console.error('[Tool] Error fetching suppliers:', error)
        return { error: 'Failed to fetch suppliers' }
      }
    }
  })

  const listLedgerAccounts = tool({
    description: 'Get a list of ledger accounts (chart of accounts) from the accounting software',
    parameters: z.object({
      limit: z.number().optional().describe('Number of ledger accounts to return (default: 10)')
    }),
    execute: async ({ limit = 10 }) => {
      console.log(`[Tool] Fetching ${limit} ledger accounts...`)

      try {
        const apideck = init(jwt)
        const response = await apideck.accounting.ledgerAccounts.list({
          limit,
          serviceId
        })

        let ledgerAccounts: any[] = []
        for await (const page of response) {
          ledgerAccounts = page.getLedgerAccountsResponse?.data || []
          break
        }

        console.log(`[Tool] Found ${ledgerAccounts.length} ledger accounts`)
        return ledgerAccounts.slice(0, limit)
      } catch (error) {
        console.error('[Tool] Error fetching ledger accounts:', error)
        return { error: 'Failed to fetch ledger accounts' }
      }
    }
  })

  const getBalanceSheet = tool({
    description: 'Get balance sheet report from the accounting software',
    parameters: z.object({
      startDate: z.string().optional().describe('Start date in YYYY-MM-DD format'),
      endDate: z.string().optional().describe('End date in YYYY-MM-DD format')
    }),
    execute: async ({ startDate, endDate }) => {
      console.log(`[Tool] Fetching balance sheet report...`)

      try {
        const apideck = init(jwt)
        const response = await apideck.accounting.balanceSheet.get({
          serviceId,
          filter: {
            startDate,
            endDate
          }
        })

        console.log(`[Tool] Retrieved balance sheet report`)
        return response.getBalanceSheetResponse?.data
      } catch (error) {
        console.error('[Tool] Error fetching balance sheet:', error)
        return { error: 'Failed to fetch balance sheet report' }
      }
    }
  })

  const listInvoiceItems = tool({
    description: 'Get a list of invoice items from the accounting software',
    parameters: z.object({
      limit: z.number().optional().describe('Number of invoice items to return (default: 10)')
    }),
    execute: async ({ limit = 10 }) => {
      console.log(`[Tool] Fetching ${limit} invoice items...`)

      try {
        const apideck = init(jwt)
        const response = await apideck.accounting.invoiceItems.list({
          limit,
          serviceId
        })

        let invoiceItems: any[] = []
        for await (const page of response) {
          invoiceItems = page.getInvoiceItemsResponse?.data || []
          break
        }

        console.log(`[Tool] Found ${invoiceItems.length} invoice items`)
        return invoiceItems.slice(0, limit)
      } catch (error) {
        console.error('[Tool] Error fetching invoice items:', error)
        return { error: 'Failed to fetch invoice items' }
      }
    }
  })

  return {
    listCustomers,
    listInvoices,
    listExpenses,
    getProfitAndLoss,
    listCreditNotes,
    listPayments,
    listPurchaseOrders,
    listSuppliers,
    listLedgerAccounts,
    getBalanceSheet,
    listInvoiceItems
  }
}

// Export individual tool creators for flexibility
export const createListCustomersTool = (context: ToolContext) =>
  createAccountingTools(context).listCustomers

export const createListInvoicesTool = (context: ToolContext) =>
  createAccountingTools(context).listInvoices

export const createListExpensesTool = (context: ToolContext) =>
  createAccountingTools(context).listExpenses

export const createProfitAndLossTool = (context: ToolContext) =>
  createAccountingTools(context).getProfitAndLoss
