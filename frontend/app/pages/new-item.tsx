import { useCallback, useState } from 'react'
import { getSession, useSession } from 'next-auth/client'
import { useRouter } from 'next/dist/client/router'
import { useForm } from 'react-hook-form'
import { GetServerSideProps } from 'next'

export default function NewItem() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { register, handleSubmit } = useForm()
  const [session, loadingSession] = useSession()

  const onSubmit = useCallback(
    async (data_form) => {
      setLoading(true)
      data_form['@type'] = 'GMI'

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_GUILLOTINA}${process.env.NEXT_PUBLIC_GUILLOTINA_DB_ACCOUNT}`,
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.accessToken}`,
            },
            method: 'POST',
            body: data_form ? JSON.stringify(data_form) : null,
          }
        )
        if (response.ok) {
          router.push('/')
        } else {
          setError('Error')
        }
        setLoading(false)
      } catch (error) {
        console.error(error)
        setError('Error')
        setLoading(false)
      }
    },
    [session, loadingSession]
  )

  return (
    <>
      {error && <h1>{error}</h1>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label className="label">Title</label>
          <div className="control">
            <input className="input" type="text" placeholder="Title" {...register('title')} />
          </div>
        </div>
        <div className="field">
          <label className="label">Text Field</label>
          <div className="control">
            <input
              className="input"
              type="text"
              placeholder="Text field"
              {...register('text_field')}
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Number Field</label>
          <div className="control">
            <input
              className="input"
              type="number"
              placeholder="Number field"
              {...register('number_field')}
            />
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button disabled={loading} type="submit" className="button is-link">
              Submit
            </button>
          </div>
        </div>
      </form>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  if (!session?.accessToken) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    }
  }
  return {
    props: {},
  }
}
