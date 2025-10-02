import {patchState, signalStore, withHooks, withMethods, withState} from '@ngrx/signals';
import {inject} from '@angular/core';
import {Player} from '../../models/player';
import {Transaction} from '../../models/transaction';
import {PlayerService} from '../services/player.service';
import {TransactionService} from '../services/transaction.service';
import {firstValueFrom, lastValueFrom} from 'rxjs';
import {DataStoreState} from '../../models/DataStoreState';

export const DataStore = signalStore(
    {providedIn: 'root'},
    withState<DataStoreState>({
        players: [] as Player[],
        transactions: [] as Transaction[],
        loading: true
    }),
    withMethods((store) => {
            const playerService = inject(PlayerService);
            const transactionService = inject(TransactionService);

            return {
                async loadData() {
                    try {
                        patchState(store, {loading: true});
                        const playersResult = await firstValueFrom(playerService.getAllPlayers());
                        const transactionsResult = await transactionService.getAllTransactions();
                        patchState(store, {players: playersResult, transactions: transactionsResult, loading: false});
                    } catch (err) {
                        console.error('Error loading data', err);
                        patchState(store, {loading: false});
                    }
                },
            }
        }
    ),
    withHooks({
        onInit({loadData}) {
            loadData();
        },
    })
);
