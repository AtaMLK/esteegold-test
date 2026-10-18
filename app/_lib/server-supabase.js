import "server-only";
import { createClient } from "@supabase/supabase-js";

function configurationError(message) {
  const error = new Error(message);
  error.status = 503;
  return error;
}

function projectUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
}

export function createPublicServerClient() {
  const url = projectUrl();
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_API_KEY;
  if (!url || !key) throw configurationError("Supabase public configuration is missing. Configure the project URL and publishable key.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export function createServiceClient() {
  const url = projectUrl();
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw configurationError("The store server is not configured. Add the server-only SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY environment variable and restart the server.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function getRequestUser(request) {
  const authorization = request.headers.get("authorization") || "";
  const token = authorization.match(/^Bearer\s+(\S+)$/i)?.[1];
  if (!token) return null;
  const { data: { user }, error } = await createPublicServerClient().auth.getUser(token);
  return error ? null : user;
}

export function isAdminUser(user) {
  if (!user?.email || !user.email_confirmed_at) return false;
  const allowed = (process.env.ADMIN_EMAILS || "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
  return allowed.includes(user.email.toLowerCase());
}

export async function requireAdmin(request) {
  return isAdminUser(await getRequestUser(request));
}
