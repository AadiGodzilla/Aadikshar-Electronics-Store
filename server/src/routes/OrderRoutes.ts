import { Router } from "express";
import OrderController from "../apis/OrderController.js";
import verifyToken from "../middleware/jwtVerify.js";
import verifyKhaltiTransaction from "../middleware/verifyTransaction.js";

const orderRouter = Router();

orderRouter.post(
    "/order",
    verifyToken,
    verifyKhaltiTransaction,
    OrderController.createOrder,
);
orderRouter.get("/order", verifyToken, OrderController.getOrderByUserId);
orderRouter.get(
    "/order/info/:orderId",
    verifyToken,
    OrderController.getOrderInfo,
);

orderRouter.get("/order/all", verifyToken, OrderController.getAllOrder);
orderRouter.get("/order/count", verifyToken, OrderController.getOrderCount);
orderRouter.put(
    "/order/status",
    verifyToken,
    verifyKhaltiTransaction,
    OrderController.updateOrderStatus,
);
orderRouter.put(
    "/order/cancel",
    verifyToken,
    verifyKhaltiTransaction,
    OrderController.cancelOrder,
);

export default orderRouter;
