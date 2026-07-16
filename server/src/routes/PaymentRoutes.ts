import { Router } from "express";
import PaymentController from "../apis/PaymentController.js";

const paymentRouter = Router();

paymentRouter.post("/payment/initiate", PaymentController.initializePayment);

export default paymentRouter;
