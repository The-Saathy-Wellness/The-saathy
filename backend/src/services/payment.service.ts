import Razorpay from "razorpay";
import { env } from "../config/env";
import { AppError } from "../exceptions/AppError";
import { createOrderSchema } from "../validators/payment.validators";

export class PaymentService {
  async createOrder(input: typeof createOrderSchema._type) {
    if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
      throw new AppError(503, "RAZORPAY_NOT_CONFIGURED", "Razorpay credentials are missing");
    }

    const razorpay = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    });

    return razorpay.orders.create({
      amount: input.amount,
      currency: input.currency,
      receipt: input.receipt,
    });
  }
}
