import {Component} from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-root-page',
  imports: [
    MatToolbar, RouterOutlet
  ],
  templateUrl: './root-page.component.html',
  styleUrl: './root-page.component.sass'
})
export class RootPageComponent {

}
