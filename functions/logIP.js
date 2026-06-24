exports.handler = async (event, context) => {
  const ip = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown'
  const { user_id, phone_number, event_type } = JSON.parse(event.body || '{}')

  const { createClient } = require('@supabase/supabase-js')
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { error } = await supabase.from('user_verifications').insert([{
    user_id,
    phone_number: phone_number || null,
    ip_address: ip,
    event_type: event_type || 'login',
    logged_at: new Date().toISOString()
  }])

  return {
    statusCode: error ? 500 : 200,
    body: JSON.stringify({ success: !error })
  }
}