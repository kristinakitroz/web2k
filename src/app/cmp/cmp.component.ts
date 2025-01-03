import { Component, Input } from '@angular/core';
import { driver } from '../../driver';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
@Component({
  selector: 'app-comp',
  standalone: true,  
  imports: [CommonModule,FormsModule],  
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

expandedIndices: { [key: number]: boolean } = {};

toggleDetails(indeks: number | undefined):void {
  if (indeks !== undefined) {
    this.expandedIndices[indeks] = !this.expandedIndices[indeks];
  }
}
isTooltipVisible: { [key: number]: boolean } = {};

toggleTooltip(indeks: number): void {
  this.isTooltipVisible[indeks] = !this.isTooltipVisible[indeks];
}
klasi2() {
   
    return {
      'begin': this.vozac?.category == 'ASD', 
      'adv': this.vozac?.category == 'EXPERT', 
      'undr': true 
    };
  }
  stilovi() {
    return 'underline';
  
  }
  ratings: { [key: number]: number } = {};
  isProcessing: boolean = false; 

  isInvalid(index: number): boolean {
    const rating = this.ratings[index];
    return rating < 1 || rating > 10;
  }
  
  onRatingChange(index: number): void {
    this.isProcessing = true;
  
    
    setTimeout(() => {
      if (this.isInvalid(index)) {
        
        console.log('Nevaliden rejting:', this.ratings[index]);
      }
  
      this.isProcessing = false;
    }, 2000); 
  }

getValidIndex(indeks: number | undefined): number {
  
  return indeks!==undefined?indeks : 0;
  }    
}