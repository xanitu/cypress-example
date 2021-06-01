;(async () => {
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
  // Delete container

  console.log('Init container', `${urlGuillotina}/${database}`)
  let response = null
  response = await fetch(`${fullUrl}`, {
    method: 'DELETE',
    headers: getHeaders(),
  })
  handleResponse(response, 'container deleted')
})()
