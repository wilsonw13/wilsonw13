import express, { type Request, type Response, type Router } from "express";
import { ServiceResponse } from "@/common/utils/serviceResponse";

export const healthRouter: Router = express.Router();

healthRouter.get("/", (_req: Request, res: Response) => {
  const serviceResponse = ServiceResponse.success("Service is healthy", null);
  res.status(serviceResponse.statusCode).send(serviceResponse);
});
