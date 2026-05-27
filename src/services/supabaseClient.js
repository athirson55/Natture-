import { createClient } from "@supabase/supabase-js";

const normalizeSupabaseUrl = (value) => {
  if (!value) return null;

  try {
    const url = new URL(value);
    const path = url.pathname.replace(
      /\/(rest|auth|storage|functions)\/v1\/?$/i,
      "",
    );
    url.pathname = path === "/" ? "" : path.replace(/\/$/, "");
    return url.origin + url.pathname;
  } catch {
    return null;
  }
};

const supabaseUrl = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL);
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
