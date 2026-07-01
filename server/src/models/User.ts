import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";

export interface ICart extends Document {
    productId: string;
    image: string;
    product: string;
    price: number;
    qty: number;
}

export interface IUser extends Document {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    image?: string;
    cart: ICart[];
    addresses: string[];
    defaultAddress: number;
    disabled: boolean;
}

export const cartSchema = new mongoose.Schema<ICart>({
    productId: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    product: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    qty: {
        type: Number,
        required: true,
    },
});

const userSchema = new mongoose.Schema<IUser>({
    fullName: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is Required"],
        unique: [true, "User already exists"],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please provide a valid email address",
        ],
    },
    password: {
        type: String,
        required: [true, "Password is Required"],
        validate: {
            validator: function (password) {
                return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/.test(
                    password,
                );
            },
            message:
                "Password must have at least one Uppercase, one Digit, one Symbol and 8 characters long",
        },
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
    },
    image: {
        type: String,
        required: [false],
    },
    cart: {
        type: [cartSchema],
        default: [],
    },
    addresses: {
        type: [String],
        default: [],
    },
    defaultAddress: {
        type: Number,
        default: 0,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

userSchema.pre<IUser>("save", async function (this: IUser) {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

export const User = mongoose.model<IUser>("users", userSchema);
