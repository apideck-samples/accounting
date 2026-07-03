import 'styles/main.css'

import { ModalProvider, ToastProvider } from '@apideck/components'
import { ConnectionsProvider, SessionProvider } from 'hooks'

import Analytics from 'components/analytics/Analytics'
import { ChatWidget } from 'components/chat/ChatWidget'
import { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Analytics source="sample:accounting">
      <ToastProvider>
        <ModalProvider>
          <SessionProvider>
            <ConnectionsProvider>
              <Component {...pageProps} />
              <ChatWidget />
            </ConnectionsProvider>
          </SessionProvider>
        </ModalProvider>
      </ToastProvider>
    </Analytics>
  )
}
