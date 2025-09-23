import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import { commonValidations } from "@/common/utils/commonValidation";
import { ServiceResponse } from "@/common/utils/serviceResponse";
import { multiLogger } from "@/common/middleware/requestLogger";

import { User } from "@/types/user.types";

import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser as repoDeleteUser
} from "@/repository/user.repository";

export const requestSchemas = {
  // Input Validation for 'POST /users' endpoint
  create: z.object({
    body: z.object({
      name: z.string(),
      email: z.string().email(),
      age: z.number(),
    }),
  }),

  // Input Validation for 'DELETE /users/:id' endpoint
  delete: z.object({
    params: z.object({ id: commonValidations.id }),
  }),

  // Input Validation for 'GET users/:id' endpoint
  get: z.object({
    params: z.object({ id: commonValidations.id }),
  })
}

// Add a new user
export async function addUser(data: { name: string; email: string; age: number }): Promise<ServiceResponse<User | null>> {
  try {
    const newUser = await createUser(data);
    return ServiceResponse.success<User>("User created", newUser, StatusCodes.CREATED);
  } catch (ex) {
    const errorMessage = `Error creating user: ${(ex as Error).message}`;
    multiLogger.error(errorMessage);
    return ServiceResponse.failure("An error occurred while creating user.", null, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

// Delete a user by ID
export async function deleteUser(id: number): Promise<ServiceResponse<null>> {
  try {
    const deleted = await repoDeleteUser(id);
    if (!deleted) {
      return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
    }
    return ServiceResponse.success<null>("User deleted", null);
  } catch (ex) {
    const errorMessage = `Error deleting user with id ${id}: ${(ex as Error).message}`;
    multiLogger.error(errorMessage);
    return ServiceResponse.failure("An error occurred while deleting user.", null, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

// Retrieves all users from the database
export async function findAll(): Promise<ServiceResponse<User[] | null>> {
  try {
    const allUsers = await getAllUsers();
    if (!allUsers || allUsers.length === 0) {
      return ServiceResponse.failure("No Users found", null, StatusCodes.NOT_FOUND);
    }
    return ServiceResponse.success<User[]>("Users found", allUsers);
  } catch (ex) {
    const errorMessage = `Error finding all users: $${(ex as Error).message}`;
    multiLogger.error(errorMessage);
    return ServiceResponse.failure(
      "An error occurred while retrieving users.",
      null,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

// Retrieves a single user by their ID
export async function findById(id: number): Promise<ServiceResponse<User | null>> {
  try {
    const user = await getUserById(id);
    if (!user) {
      return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
    }
    return ServiceResponse.success<User>("User found", user);
  } catch (ex) {
    const errorMessage = `Error finding user with id ${id}:, ${(ex as Error).message}`;
    multiLogger.error(errorMessage);
    return ServiceResponse.failure("An error occurred while finding user.", null, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
