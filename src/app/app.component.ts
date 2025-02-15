import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameAreaComponent } from './game-area/game-area.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GameAreaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = 'proekt2kolokvium';
  
}