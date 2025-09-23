import express, { type Router, type Request, type Response } from "express";
import { validateRequest } from "@/common/utils/httpHandlers";
import { requestSchemas, findAll, findById, addUser, deleteUser } from "@/services/user.service";

export const userRouter: Router = express.Router();

userRouter.get("/", async (_req: Request, res: Response) => {
  const serviceResponse = await findAll();
  res.status(serviceResponse.statusCode).send(serviceResponse);
});

userRouter.get("/:id", validateRequest(requestSchemas.get), async (req: Request, res: Response) => {
  const id = Number.parseInt(req.params.id as string, 10);
  const serviceResponse = await findById(id);
  res.status(serviceResponse.statusCode).send(serviceResponse);
});

userRouter.post("/", validateRequest(requestSchemas.create), async (req: Request, res: Response) => {
  const result = await addUser(req.body);
  res.status(result.statusCode).json(result);
});

userRouter.delete("/:id", validateRequest(requestSchemas.delete), async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await deleteUser(id);
  res.status(result.statusCode).json(result);
});