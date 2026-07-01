import type { IProduct } from "./IProduct";
import type { IUser } from "./IUser";

export type OrderStatus = "pending" | "delivered" | "returned" | "cancelled";

export type IOrder = {
    pidx: any;
    _id?: string;
    customerId?: IUser;
    products: { product: IProduct; qty: number }[];
    shippingAddress: string;
    status?: "pending" | "delivered" | "returned" | "cancelled";
    createdAt?: string;
    updatedAt?: string;
};
