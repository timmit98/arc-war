// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

serve(async (req) => {
  const { user_id } = await req.json()
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const defaultImagePath = 'defaults/default-avatar.png'
  const userImagePath = `avatars/${user_id}.png`

  // Download the default avatar from storage
  const { data: defaultAvatar, error: readErr } = await supabase.storage
    .from('avatars')
    .download(defaultImagePath)

  if (readErr || !defaultAvatar) {
    return new Response('Failed to read default image', { status: 500 })
  }

  // Upload it to the new user's avatar location
  const { error: writeErr } = await supabase.storage
    .from('avatars')
    .upload(userImagePath, defaultAvatar, {
      contentType: 'image/png',
      upsert: true
    })

  if (writeErr) {
    return new Response('Failed to upload user image', { status: 500 })
  }

  return new Response('Success', { status: 200 })
})