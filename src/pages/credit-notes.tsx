import { Button } from '@apideck/components'
import ConnectionRequiredLayout from 'components/ConnectionRequiredLayout'
import CreateCreditNoteForm from 'components/CreditNotes/CreateCreditNoteForm'
import CreditNotesTable from 'components/CreditNotes/CreditNotesTable'
import PageHeading from 'components/PageHeading'
import SlideOver from 'components/SlideOver'
import { useConnections } from 'hooks'
import { NextPage } from 'next'
import { useState } from 'react'
import { withSession } from 'utils'

const CreditNotesPage: NextPage = () => {
  const { connection } = useConnections()
  const [showCreditNoteForm, setShowCreditNoteForm] = useState<boolean>(false)

  return (
    <ConnectionRequiredLayout
      title="Credit Notes"
      description={`Manage and create credit notes using ${
        connection?.name || 'your accounting integration'
      }`}
    >
      <PageHeading
        title="Credit Notes"
        description={`Manage and create credit notes for ${
          connection?.name || 'your accounting integration'
        }`}
        action={[
          <Button
            key="credit-note"
            text="Create credit note"
            onClick={() => setShowCreditNoteForm(true)}
          />
        ]}
      />
      <div className="py-6 space-y-6 xl:space-y-8 mt-3 border-t border-gray-200 dark:border-gray-700">
        <CreditNotesTable />
      </div>
      <SlideOver
        isOpen={showCreditNoteForm}
        title={`Create a new credit note in ${connection?.name || 'your accounting integration'}`}
        onClose={() => {
          setShowCreditNoteForm(false)
        }}
      >
        <CreateCreditNoteForm
          closeForm={() => {
            setShowCreditNoteForm(false)
          }}
        />
      </SlideOver>
    </ConnectionRequiredLayout>
  )
}

export default withSession(CreditNotesPage)
