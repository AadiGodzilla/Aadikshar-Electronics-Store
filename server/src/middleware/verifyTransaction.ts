import type { NextFunction } from "express-serve-static-core";
import type { MyRequest } from "../types/Request.js";
import { User } from "../models/User.js";
import type { Response } from "express";
import axios, { AxiosError } from "axios";

export default async function verifyKhaltiTransaction(
    req: MyRequest,
    res: Response,
    next: NextFunction,
) {
    try {
        const user = await User.findById(req.userId);

        if (!user) throw new AxiosError("User does not exist", "404");
        if (user.disabled)
            throw new AxiosError("User is currently disabled", "400");

        const paymentLookup = await axios.post(
            "https://dev.khalti.com/api/v2/epayment/lookup/",
            { pidx: req.body.pidx },
            {
                headers: {
                    Authorization: `Key ${process.env.KHALTI_AUTH_KEY}`,
                },
            },
        );

        req.lookup = paymentLookup.data;

        return next();
    } catch (error) {
        const e = error as AxiosError;
        console.log(e.response?.data);
        throw e;
    }
}
