import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const { user_id, title, body, data } = await req.json()
    // TODO: Fetch push_token from profiles, send via Web Push VAPID + FCM
    console.log(`Push to ${user_id}: ${title} — ${body}`, data)
    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders })
  }
})
