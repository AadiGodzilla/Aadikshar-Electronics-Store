import mongoose, { model, Schema, type Document } from "mongoose";

export enum OrderStatus {
    PENDING = "pending",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    RETURNED = "returned",
    CANCELLED = "cancelled",
}

export interface IOrderProduct extends Document {
    product: mongoose.Types.ObjectId;
    qty: number;
}

export interface IOrder extends Document {
    pidx: string;
    customerId: mongoose.Types.ObjectId;
    shippingAddress: string;
    status: OrderStatus;
    products: IOrderProduct[];
}

const orderProductSchema = new Schema<IOrderProduct>({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
        sparse: true,
    },
    qty: {
        type: Number,
        default: 1,
    },
});

const orderSchema = new Schema<IOrder>(
    {
        pidx: {
            type: String,
            required: [true, "Transaction PIDX is required"],
            unique: [true, "Order Already Placed"],
        },
        customerId: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        products: {
            type: [orderProductSchema],
            default: [],
        },
        shippingAddress: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(OrderStatus),
            default: OrderStatus.PENDING,
        },
    },
    {
        timestamps: true,
    },
);

export const Order = model<IOrder>("orders", orderSchema);
