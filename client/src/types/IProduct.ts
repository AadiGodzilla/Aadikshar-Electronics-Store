export type ProductCategory = "basic" | "business" | "gaming" | "low power";

export type IProduct = {
    _id: string;
    images: string[];
    about: string;
    info: Record<string, string>;
    price: number;
    isFeatured: boolean;
    hidden: boolean;
    category: ProductCategory;
    qty: number;
};
