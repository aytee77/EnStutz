import {Component, inject, signal} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TransactionService} from "../../shared/services/transaction.service";
import {PlayerService} from "../../shared/services/player.service";
import {RecentTransactions} from "./recent-transactions/recent-transactions";
import {DataStore} from "../../shared/stores/data-store";
import {UserService} from '../../shared/services/user.service';
import {DiscordService} from '../../shared/services/discord.service';
import {PlayernamePipe} from '../../shared/pipes/playername-pipe';
import {firstValueFrom} from 'rxjs';

@Component({
    selector: 'stutz-home',
    imports: [
        FormsModule,
        RecentTransactions
    ],
    templateUrl: './home.html',
    styleUrl: './home.scss'
})
export class Home {
    private readonly playerService = inject(PlayerService);
    private readonly transactionService = inject(TransactionService);
    protected readonly userService = inject(UserService);
    protected readonly discordService = inject(DiscordService);
    protected readonly playernamePipe = inject(PlayernamePipe);

    protected readonly dataStore = inject(DataStore);

    showDialog = signal<boolean>(false);
    reason: string = '';
    currentPlayerId: string = '';

    protected openDialog(playerId: string) {
        this.currentPlayerId = playerId;
        this.reason = '';
        this.showDialog.set(true);
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
        this.showDialog.set(false);
        this.currentPlayerId = '';
        this.reason = '';
    }

    protected editUserName(): void {
        const newName = prompt('Enter your new username:', this.userService.getUserName() || '');
        if (newName) {
            this.userService.setUserName(newName);
        }
    }
}
