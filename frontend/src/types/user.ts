// User type matching backend User model
export interface IUser {
  id: number;
  name: string;
  email: string;
  age: number;
  createdAt: string; // ISO string from backend
  updatedAt: string; // ISO string from backend
}
