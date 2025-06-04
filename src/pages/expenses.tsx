import { Button } from '@apideck/components'
import ConnectionRequiredLayout from 'components/ConnectionRequiredLayout'
import CreateExpenseForm from 'components/Expenses/CreateExpenseForm'
import ExpensesTable from 'components/Expenses/ExpensesTable'
import PageHeading from 'components/PageHeading'
import SlideOver from 'components/SlideOver'
import { useConnections } from 'hooks'
import { NextPage } from 'next'
import { useState } from 'react'
import { withSession } from 'utils'

const ExpensesPage: NextPage = () => {
  const { connection } = useConnections()
  const [showExpenseForm, setShowExpenseForm] = useState<boolean>(false)

  return (
    <ConnectionRequiredLayout
      title="Expenses"
      description={`Manage and create expenses using ${connection?.name}`}
    >
      <PageHeading
        title="Expenses"
        description={`Manage and create expenses using ${connection?.name}`}
        action={[
          <Button key="expense" text="Create expense" onClick={() => setShowExpenseForm(true)} />
        ]}
      />
      <div className="py-6 space-y-6 xl:space-y-8 mt-3 border-t border-gray-200">
        <ExpensesTable />
      </div>
      <SlideOver
        isOpen={showExpenseForm}
        title={`Create a new expense in ${connection?.name}`}
        onClose={() => {
          setShowExpenseForm(false)
        }}
      >
        <CreateExpenseForm
          closeForm={() => {
            setShowExpenseForm(false)
          }}
        />
      </SlideOver>
    </ConnectionRequiredLayout>
  )
}

export default withSession(ExpensesPage)
