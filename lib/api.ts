import { fetchAuthSession } from "aws-amplify/auth";
export const apiConfigured = Boolean(process.env.NEXT_PUBLIC_API_URL);
export async function apiRequest<T>(
  path: string,
  body?: unknown,
  method?: string,
): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new Error("Cloud API is not configured.");
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();
  if (!token) throw new Error("Sign in again to use cloud features.");
  const response = await fetch(`${base.replace(/\/$/, "")}${path}`, {
    method: method ?? (body === undefined ? "GET" : "POST"),
    headers: { Authorization: token, "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(35000),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error ?? "Cloud request failed.");
  return result as T;
}
