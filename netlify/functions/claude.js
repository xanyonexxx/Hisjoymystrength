const https = require('https')

exports.handler = async function(event, context) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const body = event.body
    const apiKey = process.env.ANTHROPIC_API_KEY
    console.log('API Key present:', !!apiKey, 'Body:', body.substring(0, 100))

    const data = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Length': Buffer.byteLength(body)
        }
      }

      const req = https.request(options, (res) => {
        let responseData = ''
        res.on('data', (chunk) => { responseData += chunk })
        res.on('end', () => {
          try {
            resolve(JSON.parse(responseData))
          } catch(e) {
            reject(new Error('Failed to parse response: ' + responseData))
          }
        })
      })

      req.on('error', reject)
      req.write(body)
      req.end()
    })

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message })
    }
  }
}