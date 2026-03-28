import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
      const parsed = raw ? JSON.parse(raw) : {};
      const layoutData = parsed?.layoutData;

      if (!Array.isArray(layoutData)) {
        return jsonResponse({ error: "layoutData must be an array" }, 400);
      }

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
