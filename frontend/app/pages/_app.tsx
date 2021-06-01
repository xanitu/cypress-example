import { AppProps } from 'next/app'
import { Provider } from 'next-auth/client'
import 'bulma/css/bulma.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider
      session={pageProps.session}
      options={{
        keepAlive: 60 * 10, // Send keepAlive message every 10 minutes
      }}
    >
      <Component {...pageProps} />{' '}
    </Provider>
  )
}

export default MyApp
