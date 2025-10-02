import {Component, inject, TemplateRef, ViewChild} from '@angular/core';
import { TransactionService } from '../../../shared/services/transaction.service';
import {Transaction} from '../../../models/transaction';
import {AsyncPipe, DatePipe} from '@angular/common';
import {PlayernamePipe} from '../../../shared/pipes/playername-pipe';
import {DataStore} from '../../../shared/stores/data-store';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule, MatIconButton} from '@angular/material/button';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'stutz-recent-transactions',
    imports: [
        AsyncPipe,
        DatePipe,
        PlayernamePipe,
        MatTableModule,
        MatIconModule,
        MatIconButton,
        MatDialogModule,
        MatButtonModule
    ],
  templateUrl: './recent-transactions.html',
  styleUrl: './recent-transactions.scss'
})
export class RecentTransactions {
    @ViewChild('confirmDeleteDialog') private confirmDeleteDialog!: TemplateRef<any>;
    private readonly dialog = inject(MatDialog);
    private readonly transactionService = inject(TransactionService);
    protected readonly datastore = inject(DataStore);

    private dialogRef: MatDialogRef<any> | null = null;

    protected async deleteTransaction(transaction: Transaction): Promise<void> {
        this.dialogRef = this.dialog.open(this.confirmDeleteDialog, {
            data: transaction,
        });

        const confirmed = await firstValueFrom(this.dialogRef.afterClosed());
        if (confirmed) {
            await this.transactionService.deleteTransaction(transaction);
            await this.datastore.loadData();
        }
    }

    protected onCancel(): void {
        this.dialogRef?.close(false);
    }

    protected onConfirm(): void {
        this.dialogRef?.close(true);
    }
}
