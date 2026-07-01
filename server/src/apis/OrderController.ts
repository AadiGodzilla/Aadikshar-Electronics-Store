import type { Response } from "express";
import { Order, OrderStatus, type IOrderProduct } from "../models/Order.js";
import mongoose from "mongoose";
import type { MyRequest } from "../types/Request.js";
import { User } from "../models/User.js";
import axios, { AxiosError } from "axios";

const OrderController = {
    async createOrder(
        req: MyRequest<
            {},
            {},
            {
                pidx: string;
                products: IOrderProduct[];
                shippingAddress: string;
            }
        >,
        res: Response,
    ) {
        try {
            if (!req.lookup)
                return res.status(404).json({
                    message: "Transaction not found",
                });

            if (req.lookup?.status !== "Completed")
                return res.status(400).json({
                    message: "This transaction is not completed",
                });

            const user = await User.findById(req.userId);

            if (!user) throw new Error("User does not exist");
            if (user.disabled) throw new Error("User is currently disabled");

            if (user.email === "admin@shop.com")
                return res
                    .status(400)
                    .json({ message: "Admins cannot purchase products" });

            await Order.create({
                pidx: req.body.pidx,
                products: req.body.products,
                shippingAddress: req.body.shippingAddress,
                customerId: new mongoose.Types.ObjectId(req.userId),
            });

            user.cart = [];
            await user.save();

            return res.status(200).json({
                message: "Order Placed Successfully",
                user: user,
            });
        } catch (err) {
            const e = err as AxiosError;
            console.log(e.response?.data);
            throw e;
        }
    },

    async getOrderCount(req: MyRequest, res: Response) {
        try {
            const user = await User.findById(req.userId);

            if (!user) throw new Error("User does not exist");
            if (user.disabled) throw new Error("User is currently disabled");

            if (user?.email !== "admin@shop.com")
                return res
                    .status(403)
                    .json({ message: "Only admins can access this route" });

            const count = await Order.countDocuments();
            res.status(200).json({ message: count });
        } catch (error) {
            const e = error as Error;
            console.error(error);
            res.status(500).json({ message: e.message });
        }
    },

    async getAllOrder(req: MyRequest, res: Response) {
        try {
            const user = await User.findById(req.userId);

            if (!user) throw new Error("User does not exist");
            if (user.disabled) throw new Error("User is currently disabled");

            if (user?.email !== "admin@shop.com")
                return res
                    .status(403)
                    .json({ message: "Only admins can access this route" });

            const orders = await Order.find().populate([
                "products.product",
                "customerId",
            ]);
            res.status(200).json(orders);
        } catch (error) {
            const e = error as Error;
            console.error(error);
            res.status(500).json({ message: e.message });
        }
    },

    async getOrderByUserId(req: MyRequest, res: Response) {
        try {
            const id = req.userId;
            const orders = await Order.find({
                customerId: new mongoose.Types.ObjectId(id),
            }).populate("products.product");
            return res.status(200).json(orders);
        } catch (error) {
            const e = error as Error;
            console.error(error);
            res.status(500).json({ message: e.message });
        }
    },

    async getOrderInfo(req: MyRequest<{ orderId: string }>, res: Response) {
        try {
            const userId = req.userId;
            const { orderId } = req.params;

            const user = await User.findById(userId);

            if (!user)
                return res.status(404).json({ message: "User not found" });

            if (user.email === "admin@shop.com") {
                const order =
                    await Order.findById(orderId).populate("products.product");
                return res.status(200).json(order);
            }

            const order = await Order.findOne({
                _id: new mongoose.Types.ObjectId(orderId),
                customerId: new mongoose.Types.ObjectId(userId!),
            }).populate("products.product");
            return res.status(200).json(order);
        } catch (error) {
            const e = error as Error;
            console.error(error);
            res.status(500).json({ message: e.message });
        }
    },

    async updateOrderStatus(
        req: MyRequest<
            {},
            {},
            {
                pidx: string;
                orderId: string;
                status: OrderStatus;
            }
        >,
        res: Response,
    ) {
        try {
            const user = await User.findById(req.userId);

            if (!user) throw new Error("User does not exist");
            if (user.disabled) throw new Error("User is currently disabled");

            if (user.email !== "admin@shop.com")
                return res
                    .status(403)
                    .json({ message: "Unauthorized access to admin panel" });

            const order = await Order.findById(
                new mongoose.Types.ObjectId(req.body.orderId),
            );

            if (!order)
                return res
                    .status(404)
                    .json({ message: "Order does not exists" });

            if (req.body.status.toLowerCase() === "pending")
                return res
                    .status(400)
                    .json({ message: "Order cannot be set to pending" });

            if (order.status === req.body.status) return;

            // If request is cancelled or returned, then refund
            if (
                req.body.status === "cancelled" ||
                req.body.status === "returned"
            ) {
                try {
                    if (!req.lookup)
                        return res
                            .status(404)
                            .json({ message: "Transaction not Found" });

                    if (
                        req.lookup.status !== "Refunded" &&
                        req.lookup.status !== "User canceled" &&
                        !req.lookup.refunded
                    ) {
                        await axios.post(
                            `https://dev.khalti.com/api/merchant-transaction/${req.lookup.transaction_id}/refund/`,
                            {
                                mobile: "9800000005",
                            },
                            {
                                headers: {
                                    Authorization: `Key ${process.env.KHALTI_AUTH_KEY}`,
                                },
                            },
                        );
                    }
                } catch (error) {
                    throw error;
                }
            }
            order.status = req.body.status;

            await order.save();

            const orders = await Order.find().populate([
                "products.product",
                "customerId",
            ]);

            return res.status(200).json({
                message: `Order ${req.body.orderId} Set to ${req.body.status}`,
                orders: orders,
            });
        } catch (error) {
            const e = error as Error;
            console.error(e.message);
            res.status(500).json({ message: e.message });
        }
    },

    async cancelOrder(
        req: MyRequest<{}, {}, { orderId: string; pidx: string }>,
        res: Response,
    ) {
        try {
            const user = await User.findById(req.userId);
            if (!user) throw new Error("User does not exist");
            if (user.disabled) throw new Error("User is currently disabled");

            const order = await Order.findById(
                new mongoose.Types.ObjectId(req.body.orderId),
            ).populate("products.product");
            if (!order)
                return res
                    .status(404)
                    .json({ message: "User does not exists" });

            if (order.status !== OrderStatus.PENDING)
                return res.status(400).json({
                    message: "Only pending orders can be cancelled",
                });

            // Lookup Payment and Refund
            try {
                if (!req.lookup) {
                    return res
                        .status(404)
                        .json({ message: "Transaction not found" });
                }

                if (req.lookup.status !== "Refunded") {
                    await axios.post(
                        `https://dev.khalti.com/api/v2/merchant-transaction/${req.lookup.transaction_id}/refund/`,
                        {
                            mobile: "9800000005",
                        },
                        {
                            headers: {
                                Authorization: `Key ${process.env.KHALTI_AUTH_KEY}`,
                            },
                        },
                    );
                }

                order.status = OrderStatus.CANCELLED;

                await order.save();

                const orders = await Order.find({
                    customerId: new mongoose.Types.ObjectId(req.userId),
                }).populate("products.product");

                return res.status(200).json({
                    message: `Order ${req.body.orderId} Cancelled`,
                    orders: orders,
                });
            } catch (error) {
                const e = error as AxiosError;
                console.error(e.response?.data);
                const data = e.response?.data as { detail: string };
                return res
                    .status(400)
                    .json({ message: `Khalti Error: ${data.detail}` });
            }
        } catch (error) {
            const e = error as Error;
            console.error(error);
            return res.status(500).json({ message: e.message });
        }
    },
};

export default OrderController;
