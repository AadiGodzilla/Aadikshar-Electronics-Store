export interface IPaymentInitiateResponse {
    pidx: string;
    payment_url: string;
    expires_at: string;
    expires_in: number;
}

export interface IPaymentError {
    return_url: string[];
    error_key: string;
}

export interface PaymentType {
    idx: string;
    name: string;
}

export interface PaymentState {
    idx: string;
    name: string;
    template: string;
}

export interface PaymentUser {
    idx: string;
    name: string;
    mobile: string;
}

export interface PaymentMerchant {
    idx: string;
    name: string;
    mobile: string;
}

export interface PaymentRecord {
    idx: string;
    type: PaymentType;
    state: PaymentState;
    amount: number;
    fee_amount: number;
    refunded: boolean;
    created_on: string;
    ebanker: string | null;
    user: PaymentUser;
    merchant: PaymentMerchant;
}

export interface PaginatedResponse<T> {
    total_pages: number;
    total_records: number;
    next: string | null;
    previous: string | null;
    record_range: [number, number];
    current_page: number;
    records: T[];
}

export type PaymentResponse = PaginatedResponse<PaymentRecord>;
