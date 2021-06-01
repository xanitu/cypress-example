import { getSession } from 'next-auth/client'
import { useRouter } from 'next/dist/client/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { GetServerSideProps } from 'next'

export default function Login() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { register, handleSubmit } = useForm()

  const onSubmit = async (data_form) => {
    setLoading(true)
    data_form['@type'] = 'User'
    data_form['username'] = data_form['email']
    data_form['id'] = data_form['email']

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_GUILLOTINA}${process.env.NEXT_PUBLIC_GUILLOTINA_DB_ACCOUNT}@users`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: data_form ? JSON.stringify(data_form) : null,
        }
      )
      if (response.ok) {
        router.push('/register-completed')
      } else {
        setError('Error')
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
      setError('Error')
      setLoading(false)
    }
  }

  return (
    <>
      {error && <h1>{error}</h1>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label className="label">Name</label>
          <div className="control">
            <input className="input" type="text" placeholder="Name" {...register('name')} />
          </div>
        </div>
        <div className="field">
          <label className="label">Email</label>
          <div className="control">
            <input className="input" type="text" placeholder="Email" {...register('email')} />
          </div>
        </div>
        <div className="field">
          <label className="label">Password</label>
          <div className="control">
            <input
              className="input"
              type="password"
              placeholder="Password"
              {...register('password')}
            />
          </div>
        </div>
        <div className="field is-grouped">
          <div className="control">
            <button disabled={loading} className="button is-link">
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
  if (session?.accessToken) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    }
  }
  return {
    props: {},
  }
}
