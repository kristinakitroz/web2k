//smenato
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CmpComponent } from "./cmp/cmp.component";
import { DRIVERS } from '../db-data'; 
//../ se vraka eden direktorium nanazad od tekovniot
import { CommonModule } from '@angular/common';  

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet, CmpComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'web2k';

  PB = DRIVERS[0];

  JM = DRIVERS[1];

  MM = DRIVERS[2];

  vozaci = DRIVERS;

  onAppView(){
    console.log("APP E F-ja")
  }
}