import type { Request, Response } from "express";
import { Product, type IProduct } from "../models/Product.js";
import mongoose from "mongoose";
import type { MyRequest } from "../types/Request.js";
import { User } from "../models/User.js";
import path from "node:path";
import { unlink, writeFile } from "node:fs/promises";

const ProductController = {
    async createProduct(req: MyRequest<{}, {}, IProduct>, res: Response) {
        try {
            const user = await User.findById(req.userId);
            if (user?.email !== "admin@shop.com") {
                return res
                    .status(403)
                    .json({ message: "Only admins can access this route" });
            }

            const files = req.files as Express.Multer.File[];

            if (files.length === 0)
                return res
                    .status(400)
                    .json({ message: "Please provide at least one image" });

            req.body.info = JSON.parse(String(req.body.info));
            const product = await Product.create(req.body);

            const filenames = await Promise.all(
                files.map(async (file, i) => {
                    const ext = path.extname(file.originalname).toLowerCase();
                    const filename = `${product._id}-${i}${ext}`;
                    writeFile(path.join("public", filename), file.buffer);
                    return filename;
                }),
            );

            product.images = filenames;
            await product.save();

            return res
                .status(200)
                .json({ message: "Product Added Successfully" });
        } catch (error) {
            const e = error as Error;
            console.error(error);
            return res.status(500).json({ message: e.message });
        }
    },

    async getVisibleProductById(req: MyRequest<{ id: string }>, res: Response) {
        try {
            const product = await Product.findOne({
                _id: new mongoose.Types.ObjectId(req.params.id),
                hidden: false,
            });
            return res.status(200).json(product);
        } catch (error) {
            const e = error as Error;
            console.error(error);
            return res.status(500).json({ message: e.message });
        }
    },

    async getProductById(req: MyRequest<{ id: string }>, res: Response) {
        try {
            const user = await User.findById(req.userId);
            if (user?.email !== "admin@shop.com")
                return res
                    .status(403)
                    .json({ message: "Only admins can access this route" });

            const product = await Product.findById(req.params.id);
            return res.status(200).json(product);
        } catch (error) {
            const e = error as Error;
            console.error(error);
            return res.status(500).json({ message: e.message });
        }
    },

    async getAllVisibleProducts(req: Request, res: Response) {
        try {
            const products = await Product.find({ hidden: false });
            return res.status(200).json(products);
        } catch (error) {
            const e = error as Error;
            console.error(error);
            return res.status(500).json({ message: e.message });
        }
    },

    async getAllProducts(req: MyRequest, res: Response) {
        try {
            const user = await User.findById(req.userId);
            if (user?.email !== "admin@shop.com")
                return res
                    .status(403)
                    .json({ message: "Only admins can access this route" });
            const products = await Product.find();
            return res.status(200).json(products);
        } catch (error) {
            const e = error as Error;
            console.error(error);
            return res.status(500).json({ message: e.message });
        }
    },

    async getProductCount(req: Request, res: Response) {
        try {
            const count = await Product.countDocuments();
            return res.status(200).json({ message: count });
        } catch (error) {
            const e = error as Error;
            console.error(error);
            return res.status(500).json({ message: e.message });
        }
    },

    async searchProduct(
        req: Request<{}, {}, {}, { q: string }>,
        res: Response,
    ) {
        try {
            const query = req.query.q;

            if (!query) {
                const products = await Product.find({ isFeatured: true });
                return res.status(200).json(products);
            }

            if (query.trim() === "") {
                const products = await Product.find([]);
                return res.status(200).json(products);
            }

            const regex = new RegExp(query.trim(), "i");
            const numericValue = parseFloat(query);

            const conditions: any[] = [
                { about: regex },
                { info: regex },
                { images: regex },
            ];

            if (!isNaN(numericValue)) {
                conditions.push({ price: numericValue });
            }

            const results = await Product.find({ $or: conditions }).limit(20);
            return res.status(200).json(results);
        } catch (error) {
            const e = error as Error;
            console.error(error);
            return res.status(500).json({ message: e.message });
        }
    },

    async updateProduct(req: MyRequest<{}, {}, IProduct>, res: Response) {
        try {
            const user = await User.findById(req.userId);
            if (user?.email !== "admin@shop.com")
                return res
                    .status(403)
                    .json({ message: "Only admins can access this route" });

            const files = req.files as Express.Multer.File[];

            const prodId = req.body._id;
            const product = await Product.findById(prodId);

            if (!product)
                return res.status(404).json({ message: "Product not found" });

            product.about = req.body.about;
            product.info = JSON.parse(String(req.body.info));
            product.price = req.body.price;
            product.isFeatured = req.body.isFeatured;
            product.category = req.body.category;

            const filenames = await Promise.all(
                files.map(async (file, i) => {
                    const ext = path.extname(file.originalname).toLowerCase();
                    const filename = `${product._id}-${i}${ext}`;
                    writeFile(path.join("public", filename), file.buffer);
                    return filename;
                }),
            );

            product.images = filenames;

            await product.save();

            return res
                .status(200)
                .json({ message: "Product Updated Successfully" });
        } catch (error) {
            const e = error as Error;
            console.error(error);
            return res.status(500).json({ message: e.message });
        }
    },

    async toggleProduct(req: MyRequest<{ prodId: string }>, res: Response) {
        try {
            const user = await User.findById(req.userId);
            if (!user || user.email !== "admin@shop.com")
                return res
                    .status(403)
                    .json({ message: "Only admins can acces this route" });

            const { prodId } = req.params;

            const product = await Product.findById(prodId);
            if (!product)
                return res.status(404).json({ message: "Product not found" });

            product.hidden = !product.hidden;
            await product?.save();

            const products = await Product.find();

            res.status(200).json({
                message: product.hidden
                    ? "Product set to Hidden"
                    : "Product set to visible",
                products: products,
            });
        } catch (error) {
            const e = error as Error;
            console.error(error);
            return res.status(500).json({ message: e.message });
        }
    },
};

export default ProductController;
