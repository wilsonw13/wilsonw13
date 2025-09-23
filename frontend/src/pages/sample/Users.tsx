import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { getUsers, getUserById, createUser, deleteUser } from "../../api/users";

import type { IUser } from "../../types/user";

export default function Users() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [user, setUser] = useState<IUser | null>(null);
  const [createName, setCreateName] = useState<string>("");
  const [createEmail, setCreateEmail] = useState<string>("");
  const [createAge, setCreateAge] = useState<string>("");
  const [deleteId, setDeleteId] = useState<string>("");
  const [result, setResult] = useState<string>("");

  // Handlers for each button
  const handleGetUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data || []);
      setResult(JSON.stringify(res, null, 2));
    } catch (e) {
      setResult(e instanceof Error ? e.message : String(e));
    }
  };

  const handleGetUserById = async () => {
    try {
      const res = await getUserById(userId);
      setUser(res.data);
      setResult(JSON.stringify(res, null, 2));
    } catch (e) {
      setResult(e instanceof Error ? e.message : String(e));
    }
  };

  const handleCreateUser = async () => {
    try {
      const res = await createUser({ name: createName, email: createEmail, age: Number(createAge) });
      setResult(JSON.stringify(res, null, 2));
    } catch (e) {
      setResult(e instanceof Error ? e.message : String(e));
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await deleteUser(deleteId);
      setResult(JSON.stringify(res, null, 2));
    } catch (e) {
      setResult(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-neutral-900 min-h-screen text-[#213547] dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Users API Demo</h1>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <button
            className={twMerge(
              "px-4 py-2 rounded font-semibold bg-blue-600 text-white border border-blue-800 shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-blue-400 dark:hover:bg-blue-300 dark:text-blue-900 dark:border-blue-200"
            )}
            onClick={handleGetUsers}
          >
            GET /users
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            className="input input-bordered bg-white dark:bg-neutral-800 text-[#213547] dark:text-white border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 rounded px-3 py-2"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            type="number"
          />
          <button
            className={twMerge(
              "px-4 py-2 rounded font-semibold bg-blue-600 text-white border border-blue-800 shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-blue-400 dark:hover:bg-blue-300 dark:text-blue-900 dark:border-blue-200",
              !userId.trim() && "opacity-50 cursor-not-allowed"
            )}
            onClick={handleGetUserById}
            disabled={!userId.trim()}
          >
            GET /users/:id
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            className="input input-bordered bg-white dark:bg-neutral-800 text-[#213547] dark:text-white border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-green-400 rounded px-3 py-2 w-32 sm:w-40"
            placeholder="Name"
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
          />
          <input
            className="input input-bordered bg-white dark:bg-neutral-800 text-[#213547] dark:text-white border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-green-400 rounded px-3 py-2 w-40 sm:w-56"
            placeholder="Email"
            value={createEmail}
            onChange={(e) => setCreateEmail(e.target.value)}
          />
          <input
            className="input input-bordered bg-white dark:bg-neutral-800 text-[#213547] dark:text-white border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-green-400 rounded px-3 py-2 w-20"
            placeholder="Age"
            value={createAge}
            onChange={(e) => setCreateAge(e.target.value)}
            type="number"
          />
          <button
            className={twMerge(
              "px-4 py-2 rounded font-semibold bg-green-600 text-white border border-green-800 shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-green-400 dark:hover:bg-green-300 dark:text-green-900 dark:border-green-200",
              !(createName.trim() && createEmail.trim() && createAge.trim()) && "opacity-50 cursor-not-allowed"
            )}
            onClick={handleCreateUser}
            disabled={!(createName.trim() && createEmail.trim() && createAge.trim())}
          >
            POST /users
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            className="input input-bordered bg-white dark:bg-neutral-800 text-[#213547] dark:text-white border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-red-400 rounded px-3 py-2"
            placeholder="User ID"
            value={deleteId}
            onChange={(e) => setDeleteId(e.target.value)}
            type="number"
          />
          <button
            className={twMerge(
              "px-4 py-2 rounded font-semibold bg-red-600 text-white border border-red-800 shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 dark:bg-red-400 dark:hover:bg-red-300 dark:text-red-900 dark:border-red-200",
              !deleteId.trim() && "opacity-50 cursor-not-allowed"
            )}
            onClick={handleDeleteUser}
            disabled={!deleteId.trim()}
          >
            DELETE /users/:id
          </button>
        </div>
        <div>
          <h3 className="font-semibold">Result</h3>
          <pre className="bg-gray-100 dark:bg-neutral-800 p-3 rounded overflow-x-auto text-[#213547] dark:text-white">
            {result}
          </pre>
        </div>
        <div>
          <h3 className="font-semibold">Users List</h3>
          <pre className="bg-gray-100 dark:bg-neutral-800 p-3 rounded overflow-x-auto text-[#213547] dark:text-white">
            {JSON.stringify(users, null, 2)}
          </pre>
        </div>
        <div>
          <h3 className="font-semibold">Single User</h3>
          <pre className="bg-gray-100 dark:bg-neutral-800 p-3 rounded overflow-x-auto text-[#213547] dark:text-white">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
