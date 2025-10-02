import {Component, inject} from '@angular/core';
import { TransactionService } from '../../../shared/services/transaction.service';
import {Transaction} from '../../../models/transaction';
import {AsyncPipe, DatePipe} from '@angular/common';
import {PlayernamePipe} from '../../../shared/pipes/playername-pipe';
import {DataStore} from '../../../shared/stores/data-store';

@Component({
  selector: 'stutz-recent-transactions',
    imports: [
        AsyncPipe,
        DatePipe,
        PlayernamePipe
    ],
  templateUrl: './recent-transactions.html',
  styleUrl: './recent-transactions.scss'
})
export class RecentTransactions {
    private readonly transactionService = inject(TransactionService);

    protected readonly datastore = inject(DataStore);

    protected async deleteTransaction(transaction: Transaction): Promise<void> {
        const confirmed = window.confirm('Bisch sicher wotsch de stutz lösche?');
        if (confirmed) {
            await this.transactionService.deleteTransaction(transaction);
            await this.datastore.loadData();
        }
    }
}
