import {inject, Pipe, PipeTransform} from '@angular/core';
import {from, Observable} from 'rxjs';
import {DataStore} from '../stores/data-store';

@Pipe({
  name: 'playername'
})
export class PlayernamePipe implements PipeTransform {
    private datastore = inject(DataStore);

    transform(playerId: string): Observable<string> {
        const allPlayers = this.datastore.players();
        const player = allPlayers.find(p => p.id === playerId);
        return from(Promise.resolve(player ? player.name : 'Unknown Player'));

    }
}
