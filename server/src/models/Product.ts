import { model, Schema, type Document, type ObjectId } from "mongoose";

export enum ProductCategory {
    BASIC = "basic",
    BUSINESS = "business",
    GAMING = "gaming",
    LOW_POWER = "low power",
    WORKSTATION = "workstation",
}

export interface IProduct extends Document {
    images: string[];
    about: string;
    info: Record<string, string>;
    price: number;
    isFeatured: boolean;
    category: ProductCategory;
    hidden: boolean;
}

const productSchema = new Schema<IProduct>({
    images: { type: [String], required: true },
    about: { type: String, required: true },
    info: { type: Map, of: String, required: true },
    price: { type: Number, required: true },
    isFeatured: { type: Boolean, default: false },
    hidden: { type: Boolean, default: false },
    category: {
        type: String,
        enum: Object.values(ProductCategory),
        default: ProductCategory.BASIC,
    },
});

export const Product = model<IProduct>("products", productSchema);
