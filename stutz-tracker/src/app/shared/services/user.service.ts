import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private readonly userName = signal<string | null>(null);

    public constructor() {
        this.initializeUserName();
    }

    private initializeUserName(): void {
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            const storedName = localStorage.getItem('userName');
            if (storedName) {
                this.userName.set(storedName);
            } else {
                const name = prompt('Bitte gib din Name i:');
                if (name) {
                    localStorage.setItem('userName', name);
                    this.userName.set(name);
                }
            }
        } else {
            console.warn('localStorage is not available in this environment.');
        }
    }

    public getUserName(): string | null {
        return this.userName();
    }

    public setUserName(name: string): void {
        localStorage.setItem('userName', name);
        this.userName.set(name);
    }
}
