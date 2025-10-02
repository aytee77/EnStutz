import {inject, Injectable} from '@angular/core';
import {addDoc, collection, collectionData, deleteDoc, doc, Firestore, getDocs} from '@angular/fire/firestore';
import {Transaction} from '../../models/transaction';
import {PlayerService} from './player.service';
import {firstValueFrom, map, Observable} from 'rxjs';
import {Player} from '../../models/player';
import {DiscordService} from './discord.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
    private readonly firestore = inject(Firestore);
    private readonly playerService = inject(PlayerService);

    public async addTransaction(transaction: Transaction): Promise<void> {
        const transactionsCollection = collection(this.firestore, 'transactions');
        await addDoc(transactionsCollection, transaction);
    }

    public async getAllTransactions(): Promise<Transaction[]> {
        const transactionsCollection = collection(this.firestore, 'transactions');
        return firstValueFrom(
            (collectionData(transactionsCollection, { idField: 'id' }) as Observable<any[]>).pipe(
                map(transactions =>
                    transactions
                        .map(transaction => ({
                            ...transaction,
                            timestamp: (transaction.timestamp as any).toDate(),
                        }) as Transaction)
                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                )
            )
        );
    }

    public async deleteTransaction(transaction: Transaction): Promise<void> {
        await this.playerService.incrementStutz(transaction.playerId, -1)
        const transactionDoc = doc(this.firestore, `transactions/${transaction.id}`);
        await deleteDoc(transactionDoc);
    }
}
