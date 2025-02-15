import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameAreaComponent } from './game-area/game-area.component';
import { ApplicationConfig } from '@angular/core';
export const appConfig: ApplicationConfig = {
  providers: [
   
  ],
};
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GameAreaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent{
  title='proekt2kolokvium'
}
