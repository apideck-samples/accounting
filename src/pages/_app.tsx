import 'styles/main.css'

import { ModalProvider, ToastProvider } from '@apideck/components'
import { ConnectionsProvider, SessionProvider } from 'hooks'

import { ChatWidget } from 'components/ChatWidget'
import { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
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
  )
}
