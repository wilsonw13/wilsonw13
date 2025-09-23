import { User } from "@/types/user.types";

export const users: User[] = [
  {
    id: 1,
    name: "Alice",
    email: "alice@example.com",
    age: 42,
    createdAt: new Date(),
    updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
  },
  {
    id: 2,
    name: "Robert",
    email: "Robert@example.com",
    age: 21,
    createdAt: new Date(),
    updatedAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days later
  },

];

// Simulate MongoDB-like database operations

export async function getAllUsers(): Promise<User[]> {
  return users;
}

export async function getUserById(id: number): Promise<User | undefined> {
  return users.find(u => u.id === id);
}

export async function createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
  const newUser: User = {
    ...user,
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  users.push(newUser);
  return newUser;
}

export async function updateUser(id: number, updates: Partial<Omit<User, "id" | "createdAt">>): Promise<User | undefined> {
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return undefined;
  users[idx] = {
    ...users[idx],
    ...updates,
    updatedAt: new Date(),
  };
  return users[idx];
}

export async function deleteUser(id: number): Promise<User | undefined> {
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return undefined;
  const [deleted] = users.splice(idx, 1);
  return deleted;
}