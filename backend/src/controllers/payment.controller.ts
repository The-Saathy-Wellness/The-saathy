import { Request, Response } from "express";
import { PaymentService } from "../services/payment.service";
import { validateBody } from "../utils/validation";
import { createOrderSchema } from "../validators/payment.validators";

const payments = new PaymentService();

export const createOrder = async (req: Request, res: Response) => {
  const body = validateBody(createOrderSchema, req);
  res.status(201).json(await payments.createOrder(body));
};
