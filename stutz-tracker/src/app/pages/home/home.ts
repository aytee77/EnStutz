import {Component, computed, inject, signal, TemplateRef, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TransactionService} from "../../shared/services/transaction.service";
import {PlayerService} from "../../shared/services/player.service";
import {RecentTransactions} from "./recent-transactions/recent-transactions";
import {DataStore} from "../../shared/stores/data-store";
import {UserService} from '../../shared/services/user.service';
import {DiscordService} from '../../shared/services/discord.service';
import {PlayernamePipe} from '../../shared/pipes/playername-pipe';
import {firstValueFrom} from 'rxjs';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';

@Component({
    selector: 'stutz-home',
    imports: [
        FormsModule,
        RecentTransactions,
        MatButtonModule,
        MatTableModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule
    ],
    templateUrl: './home.html',
    styleUrl: './home.scss'
})
export class Home {
    @ViewChild('editUserNameDialog') protected editUserNameDialog!: TemplateRef<any>;
    readonly dialog = inject(MatDialog);
    private readonly playerService = inject(PlayerService);
    private readonly transactionService = inject(TransactionService);
    protected readonly userService = inject(UserService);
    protected readonly discordService = inject(DiscordService);
    protected readonly playernamePipe = inject(PlayernamePipe);

    protected totalStutz = computed(() => this.dataStore.players().reduce((sum, player) => sum + player.stutz, 0));

    protected readonly dataStore = inject(DataStore);

    reason: string = '';
    currentPlayerId: string = '';
    protected tempUserName: string = '';


    protected openDialog(playerId: string, dialogTemplate: TemplateRef<any>) {
        this.currentPlayerId = playerId;
        this.reason = '';
        this.dialog.open(dialogTemplate);
    }

    public async addStutz() {
        if (!this.currentPlayerId) return;

        const transaction = {
            playerId: this.currentPlayerId,
            amount: 1,
            reason: this.reason || 'Kein Grund angegeben',
            addedBy: this.userService.getUserName() || 'Unbekannt',
            timestamp: new Date()
        }

        await this.playerService.incrementStutz(this.currentPlayerId, 1);
        await this.transactionService.addTransaction(transaction);

        this.discordService.sendTransactionMessage({
            ...transaction,
            playerName: await firstValueFrom(this.playernamePipe.transform(this.currentPlayerId))
        }).then();

        await this.dataStore.loadData();
        this.closeDialog();
    }

    protected closeDialog() {
        this.dialog.closeAll();
        this.currentPlayerId = '';
        this.reason = '';
    }

    protected editUserName(): void {
        this.tempUserName = this.userService.getUserName() || '';
        this.dialog.open(this.editUserNameDialog);
    }

    protected saveUserName(): void {
        if (this.tempUserName) {
            this.userService.setUserName(this.tempUserName);
        }
        this.closeDialog();
    }
}
