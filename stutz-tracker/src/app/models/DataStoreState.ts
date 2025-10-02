import { Player } from './player';
import { Transaction } from './transaction';

export interface DataStoreState {
    players: Player[];
    transactions: Transaction[];
    loading: boolean;
}
