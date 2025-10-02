export interface Transaction {
    id?: string;
    playerId: string;
    amount: number;
    reason: string;
    addedBy: string;
    timestamp: Date;
}
