interface CustomerInfo {
    name: string;
    email: string;
    phone: string;
}

interface ProductDetail {
    identity: string;
    name: string;
    total_price: number;
    quantity: number;
}

export interface IPaymentPayload {
    amount: number;
    purchase_order_id: string;
    purchase_order_name: string;
    customer_info: CustomerInfo;
    product_details: ProductDetail[];
}

export interface IPaymentResponse {
    pidx: string;
    payment_url: string;
    expires_at: string;
    expires_in: number;
}
