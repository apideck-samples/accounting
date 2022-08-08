import 'styles/main.css'

import { ConnectionsProvider, SessionProvider } from 'utils'
import { ModalProvider, ToastProvider } from '@apideck/components'

import { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ToastProvider>
      <ModalProvider>
        <SessionProvider>
          <ConnectionsProvider>
            <Component {...pageProps} />
          </ConnectionsProvider>
        </SessionProvider>
      </ModalProvider>
    </ToastProvider>
  )
}
