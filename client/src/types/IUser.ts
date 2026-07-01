import type { ICart } from "./ICart";

export interface IUser {
    _id: string;
    fullName: string;
    email: string;
    password: string;
    phone: string;
    cart: ICart[];
    image?: string;
    addresses: string[];
    defaultAddress: number;
    disabled: boolean;
}
