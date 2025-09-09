import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  action: 'register_session' | 'validate_session' | 'logout_other_sessions';
  session_id?: string;
  device_info?: any;
  ip_address?: string;
  user_agent?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract the JWT token
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the user
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body: RequestBody = await req.json();
    
    switch (body.action) {
      case 'register_session': {
        if (!body.session_id) {
          return new Response(
            JSON.stringify({ error: 'Session ID required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // First, deactivate all other sessions for this user
        const { error: deactivateError } = await supabase
          .from('user_sessions')
          .update({ is_active: false })
          .eq('user_id', user.id)
          .eq('is_active', true);

        if (deactivateError) {
          console.error('Error deactivating other sessions:', deactivateError);
        }

        // Create new session record
        const { data, error } = await supabase
          .from('user_sessions')
          .insert({
            user_id: user.id,
            session_id: body.session_id,
            device_info: body.device_info || {},
            ip_address: body.ip_address,
            user_agent: body.user_agent,
            is_active: true
          })
          .select()
          .single();

        if (error) {
          return new Response(
            JSON.stringify({ error: 'Failed to register session', details: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, session_data: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'validate_session': {
        if (!body.session_id) {
          return new Response(
            JSON.stringify({ error: 'Session ID required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Check if this session is the active one for the user
        const { data: sessionData, error } = await supabase
          .from('user_sessions')
          .select('*')
          .eq('user_id', user.id)
          .eq('session_id', body.session_id)
          .eq('is_active', true)
          .gt('expires_at', new Date().toISOString())
          .single();

        if (error || !sessionData) {
          return new Response(
            JSON.stringify({ valid: false, reason: 'Session not found or expired' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Update last activity
        await supabase
          .from('user_sessions')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', sessionData.id);

        return new Response(
          JSON.stringify({ valid: true, session_data: sessionData }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'logout_other_sessions': {
        // Deactivate all sessions except the current one
        const { error } = await supabase
          .from('user_sessions')
          .update({ is_active: false })
          .eq('user_id', user.id)
          .neq('session_id', body.session_id || '')
          .eq('is_active', true);

        if (error) {
          return new Response(
            JSON.stringify({ error: 'Failed to logout other sessions', details: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Session manager error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});