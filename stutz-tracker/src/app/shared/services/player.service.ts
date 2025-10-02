import {inject, Injectable } from '@angular/core';
import {collectionData, doc, increment, updateDoc, Firestore, getDoc, query, orderBy} from '@angular/fire/firestore';
import {collection } from 'firebase/firestore';
import { Observable } from 'rxjs';
import {Player} from '../../models/player';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
    private readonly firestore = inject(Firestore);

    public getAllPlayers(): Observable<Player[]> {
        const playersCollection = collection(this.firestore, 'players');
        const playersQuery = query(playersCollection, orderBy('stutz', 'desc'));
        return collectionData(playersQuery, { idField: 'id' }) as Observable<Player[]>;
    }

    public async incrementStutz(playerId: string, amount: number): Promise<void> {
        const playerDoc = doc(this.firestore, `players/${playerId}`);
        await updateDoc(playerDoc, { stutz: increment(amount) });
    }

    public async getPlayerName(playerId: string): Promise<string> {
        const playerDoc = await getDoc(doc(this.firestore, 'players', playerId));
        return playerDoc.exists() ? (playerDoc.data() as any).name : 'Unknown Player';
    }
}
