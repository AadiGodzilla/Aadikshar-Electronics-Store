import { Router } from "express";
import ProductController from "../apis/ProductController.js";
import upload from "../middleware/multer.js";
import verifyToken from "../middleware/jwtVerify.js";

const productRouter = Router();

productRouter.post(
    "/product",
    verifyToken,
    upload.array("images"),
    ProductController.createProduct,
);
productRouter.get("/product", ProductController.getAllVisibleProducts);
productRouter.get(
    "/product/single/:id",
    ProductController.getVisibleProductById,
);
productRouter.get(
    "/product/admin",
    verifyToken,
    ProductController.getAllProducts,
);
productRouter.get(
    "/product/admin/single/:id",
    verifyToken,
    ProductController.getProductById,
);
productRouter.get("/product/count", ProductController.getProductCount);
productRouter.put(
    "/product",
    verifyToken,
    upload.array("images"),
    ProductController.updateProduct,
);
productRouter.put(
    "/product/toggle/:prodId",
    verifyToken,
    ProductController.toggleProduct,
);

export default productRouter;
