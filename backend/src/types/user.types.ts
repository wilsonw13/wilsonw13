import { z } from "zod";
import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { commonValidations } from "@/common/utils/commonValidation";
import { createApiResponse, openAPIRequestBody } from "@/types/openApi.types";

extendZodWithOpenApi(z);

export type User = z.infer<typeof UserSchema>;
export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  age: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetUserSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const userRegistry = new OpenAPIRegistry();
userRegistry.register("User", UserSchema);

// OpenAPI path registrations for user endpoints
userRegistry.registerPath({
  method: "get",
  path: "/users",
  tags: ["User"],
  responses: createApiResponse(z.array(UserSchema), "Success"),
});

userRegistry.registerPath({
  method: "get",
  path: "/users/{id}",
  tags: ["User"],
  request: { params: GetUserSchema.shape.params },
  responses: createApiResponse(UserSchema, "Success"),
});

userRegistry.registerPath({
  method: "post",
  path: "/users",
  tags: ["User"],
  request: openAPIRequestBody(UserSchema),
  responses: createApiResponse(UserSchema, "User created"),
});

userRegistry.registerPath({
  method: "delete",
  path: "/users/{id}",
  tags: ["User"],
  request: { params: GetUserSchema.shape.params },
  responses: createApiResponse(z.object({ success: z.boolean() }), "User deleted"),
});
