import { apiFetch } from "./index";

// Example: get all users
export async function getUsers() {
  const res = await apiFetch("/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

// Example: get user by ID
export async function getUserById(id: string | number) {
  const res = await apiFetch(`/users/${id}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

// Create user: expects { name, email, age }
export async function createUser(data: { name: string; email: string; age: number }) {
  const res = await apiFetch("/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
}

// Delete user by ID
export async function deleteUser(id: string | number) {
  const res = await apiFetch(`/users/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete user");
  return res.json();
}
