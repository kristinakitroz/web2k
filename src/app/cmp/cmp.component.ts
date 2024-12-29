import { Component, Input } from '@angular/core';
import { driver } from '../../driver';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-comp',
  standalone: true,  
  imports: [CommonModule],  
  templateUrl: './cmp.component.html',
  styleUrls: ['./cmp.component.css']
})
export class CmpComponent {

  @Input()
  vozac:driver | undefined;

  @Input()
  indeks:number | undefined;
  

  //onDrvView(){
    //console.log("KLIKNA ME")
  //}

  onDrvView() {
    
    let link: string | undefined;
    

    if (this.vozac?.iconUrl) {
      link = this.vozac?.iconUrl;
      
    } else {
      link = "https://www.google.com";
      
    }

    window.open(link, "_blank");
    
  }
  stilovi() {
    return 'underline';
  
  }
}