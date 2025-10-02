import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Transaction} from '../../models/transaction';
import {PlayernamePipe} from '../pipes/playername-pipe';


@Injectable({
    providedIn: 'root',
})
export class DiscordService {
    private readonly netlifyFunctionUrl = environment.netlify.url + 'sendTransactionToDiscord';
    private readonly http = inject(HttpClient);

    public sendTransactionMessage(transaction: any): Promise<object> {
        return firstValueFrom(this.http.post(this.netlifyFunctionUrl, transaction));
    }
}
