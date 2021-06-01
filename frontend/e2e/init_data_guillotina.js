;(async () => {
  // Payloads
  const env = {
    USER: 'user_test_manager@test.cat',
    PASSWORD_UNIVERSAL: 'Iskra1234',
  }

  const fetch = require('node-fetch')
  console.log(process.argv[2])
  console.log(process.argv[3])

  const database = 'db'
  if (process.argv.length < 4) {
    throw new Error('Falten parametres')
  }

  const urlGuillotina = process.argv[2]
  const containerName = process.argv[3]

  const fullUrl = `${urlGuillotina}/${database}/${containerName}/`

  const getHeaders = (token) => {
    let auth = 'Basic cm9vdDpyb290'
    if (token) {
      auth = `Bearer ${token}`
    }

    return {
      Authorization: auth,
      'Content-Type': 'application/json',
    }
  }

  const handleResponse = async (response, msg) => {
    if (response.ok) {
      console.log(msg)
    } else {
      console.log(`Error ${msg}`, await response.json())
    }
  }
  // Init container

  console.log('Init container', `${urlGuillotina}/${database}`)
  let response = null
  response = await fetch(`${urlGuillotina}/${database}`, {
    method: 'POST',
    body: JSON.stringify({ '@type': 'Container', id: containerName }),
    headers: getHeaders(),
  })
  handleResponse(response, 'Add container')

  response = await fetch(`${fullUrl}@addons`, {
    method: 'POST',
    body: JSON.stringify({ id: 'dbusers' }),
    headers: getHeaders(),
  })
  handleResponse(response, 'add addon dbusers')

  // Create USER
  response = await fetch(`${fullUrl}users`, {
    method: 'POST',
    body: JSON.stringify({
      '@type': 'User',
      id: env['USER'],
      name: 'Test name',
      username: env['USER'],
      password: env['PASSWORD_UNIVERSAL'],
      email: env['USER'],
    }),
    headers: getHeaders(),
  })

  handleResponse(response, 'add USER')
})()
