import {Component} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {MatToolbar} from "@angular/material/toolbar";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
  ],
    styleUrl: './app.component.sass'
})
export class AppComponent {

}
