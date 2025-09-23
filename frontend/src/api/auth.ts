import { apiFetch } from "./index";

// TODO
// Example: login
export async function login(username: string, password: string) {
  const res = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

// Example: logout
export async function logout() {
  const res = await apiFetch("/auth/logout", { method: "POST" });
  if (!res.ok) throw new Error("Logout failed");
  return res.json();
}
