import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import type { MyRequest } from "../types/Request.js";

export default function verifyToken(
    req: MyRequest,
    res: Response,
    next: NextFunction,
) {
    const token = req.headers.authorization ?? "";
    if (!token || token === "")
        return res.status(404).json({ message: "Token is missing" });

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(403).json({ message: err.message });
        }
        req.userId = decoded as string;
        next();
    });
}
