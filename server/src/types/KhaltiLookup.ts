export interface KhaltiLookupResponse {
    pidx: string;
    total_amount: number;
    status: string;
    transaction_id: string | null;
    fee: number;
    refunded: boolean;
}
