import Layout from 'components/Layout'
import { NextPage } from 'next'
import ProfitAndLoss from 'components/ProfitAndLoss'
import { useConnections } from 'hooks'
import { withSession } from 'utils'

const IndexPage: NextPage = () => {
  const { connection } = useConnections()

  return (
    <Layout title="Dashboard">
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center truncate">
        {connection && <ProfitAndLoss />}
      </div>
    </Layout>
  )
}

export default withSession(IndexPage)
