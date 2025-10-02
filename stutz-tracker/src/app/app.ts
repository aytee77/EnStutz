import {Component, inject, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {UserService} from './shared/services/user.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {
    protected readonly title = signal('stutz-tracker');
}
