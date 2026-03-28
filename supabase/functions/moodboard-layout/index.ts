import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const LAYOUT_ROW_ID = "11111111-1111-4111-8111-111111111111";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function stripUnpairedSurrogates(input: string) {
  let out = "";
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = input.charCodeAt(i + 1);
      if (next >= 0xdc00 && next <= 0xdfff) {
        out += input[i] + input[i + 1];
        i++;
      }
      continue;
    }
    if (code >= 0xdc00 && code <= 0xdfff) continue;
    out += input[i];
  }
  return out;
}

function sanitizeJsonValue(value: unknown): unknown {
  if (typeof value === "string") return stripUnpairedSurrogates(value);
  if (Array.isArray(value)) return value.map((v) => sanitizeJsonValue(v));
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = sanitizeJsonValue(v);
    }
    return out;
  }
  return value;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return jsonResponse({ error: "Missing server environment configuration" }, 500);
    }

    const db = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    if (req.method === "GET") {
      const { data: byId, error: byIdError } = await db
        .from("moodboard_layouts")
        .select("layout_data")
        .eq("id", LAYOUT_ROW_ID)
        .maybeSingle();

      if (byIdError) throw byIdError;

      if (byId?.layout_data) {
        return jsonResponse({ layoutData: byId.layout_data, source: "cloud" });
      }

      const { data: latestRows, error: latestError } = await db
        .from("moodboard_layouts")
        .select("layout_data")
        .order("updated_at", { ascending: false })
        .limit(1);

      if (latestError) throw latestError;

      const latest = latestRows?.[0]?.layout_data ?? null;
      return jsonResponse({ layoutData: latest, source: latest ? "cloud-legacy" : "empty" });
    }

    if (req.method === "POST") {
      const raw = await req.text();
      let parsed: Record<string, unknown> = {};

      if (raw) {
        try {
          parsed = JSON.parse(raw);
        } catch {
          return jsonResponse({ error: "Invalid JSON body" }, 400);
        }
      }

      const incomingLayoutData = parsed?.layoutData;

      if (!Array.isArray(incomingLayoutData)) {
        return jsonResponse({ error: "layoutData must be an array" }, 400);
      }

      const layoutData = sanitizeJsonValue(incomingLayoutData);

      const { error: saveError } = await db.from("moodboard_layouts").upsert(
        {
          id: LAYOUT_ROW_ID,
          layout_data: layoutData,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      if (saveError) throw saveError;

      return jsonResponse({ ok: true, count: layoutData.length });
    }

    return jsonResponse({ error: "Method not allowed" }, 405);
  } catch (error) {
    console.error("moodboard-layout function error:", error);
    const message = error instanceof Error ? error.message : "Unexpected error";
    return jsonResponse({ error: message }, 500);
  }
});
