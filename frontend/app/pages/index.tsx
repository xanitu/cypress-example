import { signOut, useSession } from 'next-auth/client'
import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [error, setError] = useState('')
  const [session, loading] = useSession()
  const [allData, setAllDAta] = useState(undefined)
  const [loadingData, setLoadingData] = useState(false)

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_GUILLOTINA}${process.env.NEXT_PUBLIC_GUILLOTINA_DB_ACCOUNT}@search?type_name=GMI`,
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.accessToken}`,
            },
            method: 'GET',
          }
        )
        if (response.ok) {
          const responseJson = await response.json()
          setAllDAta(responseJson['items'])
        } else {
          setError('Error')
        }
        setLoadingData(false)
      } catch (error) {
        console.error(error)
        setError('Error')
        setLoadingData(false)
      }
    }

    if (allData === undefined && !loadingData && session) {
      getData()
    }
  }, [allData, loadingData, session])

  const router = useRouter()
  return (
    <div>
      <Head>
        <title>Iskra Cypress</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container is-flex is-justify-content-center">
        <h1 className="is-size-1">App d&apos;exemple testos de cypress</h1>
      </main>

      {session && !loading && (
        <div>
          <div>USER LOGGED</div>
          <button
            onClick={() => {
              signOut({ redirect: false })
              router.push('/login')
            }}
          >
            LOGOUT
          </button>
        </div>
      )}

      {!session && !loading && <Link href="/login">Go To login</Link>}
      <br />
      <Link href="/new-item">Go To New Item</Link>
      {error && <h1>{error}</h1>}
      {loadingData && <div>Loading data Guillo</div>}
      {!loadingData && allData && allData.map((item) => <div key={item['@id']}>{item.title}</div>)}
      <footer className="container is-flex is-justify-content-center">
        <a href="https://www.iskra.cat" target="_blank" rel="noopener noreferrer">
          Iskra
        </a>
      </footer>
    </div>
  )
}
