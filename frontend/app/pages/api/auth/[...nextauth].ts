import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const providers = [
  Providers.Credentials({
    name: 'Credentials',
    credentials: {},
    authorize: async (credentials: any) => {
      console.log('NEXT_PUBLIC_GUILLOTINA', process.env.NEXT_PUBLIC_GUILLOTINA)
      console.log('NEXTAUTH_URL', process.env.NEXTAUTH_URL)
      console.log(
        'NEXT_PUBLIC_GUILLOTINA_DB_ACCOUNT',
        process.env.NEXT_PUBLIC_GUILLOTINA_DB_ACCOUNT
      )

      const user = await fetch(
        `${process.env.NEXT_PUBLIC_GUILLOTINA}${process.env.NEXT_PUBLIC_GUILLOTINA_DB_ACCOUNT}@login`,
        {
          method: 'POST',
          headers: {
            accept: '*/*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password: credentials.password,
            username: credentials.username,
          }),
        }
      )

      if (user.ok) {
        return await user.json()
      } else {
        return null
      }
    },
  }),
]

const callbacks = {
  async signIn(user) {
    return user
  },

  // Getting the JWT token from API response
  async jwt(token, user) {
    if (user) {
      token.accessToken = user.token
    }

    return token
  },

  async session(session, token) {
    if (token && Object.keys(token).length > 0) {
      session.accessToken = token.accessToken
      session.user = token.user
      return session
    }
    return {}
  },
}

const options = {
  providers,
  callbacks,
}

export default (req, res) => NextAuth(req, res, options)
