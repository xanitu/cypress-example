import { useState } from 'react'
import { getSession, signIn } from 'next-auth/client'
import { useRouter } from 'next/dist/client/router'
import { useForm } from 'react-hook-form'
import { GetServerSideProps } from 'next'

export default function Login() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    const response = (await signIn('credentials', {
      ...data,
      redirect: false,
    })) as any

    if (response.ok) {
      router.push('/')
    } else {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="field">
        <label className="label">Username</label>
        <div className="control">
          <input className="input" type="text" placeholder="Username" {...register('username')} />
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
          <button disabled={loading} type="submit" className="button is-link">
            Submit
          </button>
        </div>
      </div>
    </form>
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
