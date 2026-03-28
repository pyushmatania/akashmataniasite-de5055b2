import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const PIN_ROW_ID = '00000000-0000-0000-0000-000000000001';

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pin, action } = await req.json();

    if (!pin || typeof pin !== 'string' || !/^\d{4}$/.test(pin)) {
      return new Response(JSON.stringify({ error: 'Invalid PIN format' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!action || !['setup', 'verify'].includes(action)) {
      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const sb = createClient(supabaseUrl, supabaseKey);

    const hashed = await sha256(pin);

    if (action === 'setup') {
      // Check if PIN already exists
      const { data: existing } = await sb
        .from('moodboard_pins')
        .select('id')
        .eq('id', PIN_ROW_ID)
        .maybeSingle();

      if (existing) {
        return new Response(JSON.stringify({ error: 'PIN already set' }), {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { error } = await sb.from('moodboard_pins').upsert({
        id: PIN_ROW_ID,
        pin_hash: hashed,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

      if (error) {
        return new Response(JSON.stringify({ error: 'Failed to save PIN' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify
    const { data: pinRow, error: readErr } = await sb
      .from('moodboard_pins')
      .select('pin_hash')
      .eq('id', PIN_ROW_ID)
      .maybeSingle();

    if (readErr || !pinRow) {
      return new Response(JSON.stringify({ error: 'PIN not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const valid = pinRow.pin_hash === hashed;
    return new Response(JSON.stringify({ valid }), {
      status: valid ? 200 : 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
