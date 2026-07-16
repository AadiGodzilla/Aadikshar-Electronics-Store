import axios, { AxiosError } from "axios";
import type { Request, Response } from "express";
import type { IPaymentPayload } from "../types/PaymentPayload.js";

const PaymentController = {
    async initializePayment(
        req: Request<{}, {}, IPaymentPayload>,
        res: Response,
    ) {
        try {
            const paymentResponse = await axios.post(
                "https://dev.khalti.com/api/v2/epayment/initiate/",
                {
                    return_url: "http://localhost:3000/payment-verify",
                    website_url: "http://localhost:3000/",
                    amount: req.body.amount * 100 + 100000,
                    purchase_order_id: req.body.purchase_order_id,
                    purchase_order_name: req.body.purchase_order_name,
                    customer_info: req.body.customer_info,
                    amount_breakdown: [
                        {
                            label: "Mark Price",
                            amount: req.body.amount * 100,
                        },
                        {
                            label: "Delivery Fee",
                            amount: 100000,
                        },
                    ],
                    product_details: req.body.product_details,
                    merchant_username: "Aadikshar Electronics Store",
                    merchant_extra: "Aadikshar Electronics Store",
                },
                {
                    headers: {
                        Authorization: `key ${process.env.KHALTI_AUTH_KEY}`,
                        "Content-Type": "application/json",
                    },
                },
            );
            return res.status(200).json(paymentResponse.data);
        } catch (error) {
            const err = error as AxiosError;
            const body = err.response?.data;
            return res.status(err.status!).json(body);
        }
    },
};

export default PaymentController;
