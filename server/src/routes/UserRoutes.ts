import { Router } from "express";
import UserController from "../apis/UserController.js";
import verifyToken from "../middleware/jwtVerify.js";

const userRouter = Router();

userRouter.post("/user", UserController.createUser);
userRouter.get("/user", verifyToken, UserController.getUserProfile);
userRouter.get("/user/info/:id", verifyToken, UserController.getUserById);
userRouter.get("/user/info", verifyToken, UserController.getAllUsers);
userRouter.get("/user/count", verifyToken, UserController.getUserCount);
userRouter.post("/user/login", UserController.loginUser);
userRouter.post("/user/cart/add", verifyToken, UserController.addToCart);
userRouter.delete(
    "/user/cart/remove",
    verifyToken,
    UserController.removeAllFromCart,
);
userRouter.delete(
    "/user/cart/remove/:cartId",
    verifyToken,
    UserController.removeFromCart,
);
userRouter.post("/user/address/add", verifyToken, UserController.addAddress);
userRouter.put("/user/update", verifyToken, UserController.updateUserProfile);
userRouter.delete(
    "/user/address/del/:index",
    verifyToken,
    UserController.removeAddress,
);
userRouter.put(
    "/user/address/default/:index",
    verifyToken,
    UserController.setDefaultAddress,
);
userRouter.delete("/user/toggle/:id", verifyToken, UserController.toggleUser);

export default userRouter;
