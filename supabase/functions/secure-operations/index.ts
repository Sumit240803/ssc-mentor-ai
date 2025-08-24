import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  action: 'get-user-stats' | 'update-profile' | 'delete-account';
  data?: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get Supabase client with service role for admin operations
    const supabaseClient = createClient(
      'https://jaaqkpacpgidnwnralot.supabase.co',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get user from JWT
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    
    const { data: user, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      console.error('Auth error:', authError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Processing request for user: ${user.user?.id}`)

    const { action, data }: RequestBody = await req.json()

    switch (action) {
      case 'get-user-stats': {
        // Get user statistics securely
        const { data: posts, error: postsError } = await supabaseClient
          .from('posts')
          .select('id, created_at')
          .eq('user_id', user.user!.id)

        if (postsError) {
          console.error('Posts error:', postsError)
          throw postsError
        }

        const { data: profile, error: profileError } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('user_id', user.user!.id)
          .single()

        if (profileError) {
          console.error('Profile error:', profileError)
          throw profileError
        }

        const stats = {
          totalPosts: posts?.length || 0,
          joinedAt: profile?.created_at,
          profile: profile
        }

        return new Response(
          JSON.stringify({ data: stats }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'update-profile': {
        // Securely update user profile
        const { error: updateError } = await supabaseClient
          .from('profiles')
          .update(data)
          .eq('user_id', user.user!.id)

        if (updateError) {
          console.error('Update error:', updateError)
          throw updateError
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'delete-account': {
        // Securely delete user account (admin operation)
        const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(user.user!.id)

        if (deleteError) {
          console.error('Delete error:', deleteError)
          throw deleteError
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
    }

  } catch (error) {
    console.error('Function error:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})