import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-area',
  standalone: true,
  imports: [CommonModule],
  //elementi koi ke se koristat vo igrata 
  template: `
    <div class="game-area">
    <div class="content">
      <p>Собери ги сите коски за да победиш!</p>
     </div>
      <div class="dog" [style.left.px]="dogPosition.x" [style.top.px]="dogPosition.y"></div>
      
      <div class="bone" 
           *ngFor="let bone of bones" 
           [style.left.px]="bone.x" 
           [style.top.px]="bone.y">
      </div>
      
      <div class="house" 
           [style.left.px]="house.x" 
           [style.top.px]="house.y">
      </div>

      <div class="platform" 
           *ngFor="let platform of platforms" 
           [ngClass]="platform.type"
           [style.left.px]="platform.x" 
           [style.top.px]="platform.y" 
           [style.width.px]="platform.width" 
           [style.height.px]="platform.height">
      </div>
      
    </div>
  `,
  styleUrls: ['./game-area.component.scss']
})
export class GameAreaComponent {
  jumpSound!: HTMLAudioElement;
  collectBoneSound!: HTMLAudioElement;
  backgroundMusic!: HTMLAudioElement;
  winSound!: HTMLAudioElement;
  failure!: HTMLAudioElement;

  dogPosition = { x: 50, y: 100 ,width:50,height:50 };
  isJumping = false;
  gravity = 0.5;
  jumpStrength = 17;
  velocityY = 0;
  isGameOver = false;
  isGameActive = false;
  totalBones: number = 0;  
  collectedBones = 0; 
  isOnPlatform = false;
  horizontalVelocity = 10;
  isMovingLeft = false;
isMovingRight = false;
velocityX = 0;

horizontalSpeed = 2;  
  house: { x: number, y: number ,width:number,height:number} = { x: 0, y: 20 ,width:20,height:20 };
  groundLevel: number=0;

  //postavuvanje na platformite
  platforms = [
    { x: 300, y: 220, width: 110, height: 70, type:'platform3'},
    { x: 600, y: 390, width: 100, height: 50, type:'platform4'},
    { x: 1200, y: 300, width: 100, height: 100, type:'platform1'},
  ];
//postavuvanje koski
  bones = this.platforms.map((platform) => ({
    x: platform.x + platform.width / 2 - 10,
    y: platform.y - 30,
    width: 30, 
  height: 30 
  }));
//proverka dali se koristi prelistuvac
  get isBrowser(): boolean {
    return typeof window !== 'undefined';
  }
//inicijalizacija
  ngOnInit() {
    if (this.isBrowser) {
      const groundLevel = window.innerHeight - 280; 
      this.house = { x: window.innerWidth - 100, y: groundLevel ,width:20,height:20 };
      this.dogPosition = { x: 50, y: groundLevel ,width:50,height:50}; 
      this.totalBones = this.bones.length; 
   
      
        this.jumpSound = new Audio('assets/sounds/jump.wav');
        this.collectBoneSound = new Audio('assets/sounds/collect_bone.wav');
        this.backgroundMusic = new Audio('assets/sounds/background.mp3');
        this.winSound = new Audio('assets/sounds/win.mp3');
        this.failure = new Audio('assets/sounds/failure.mp3');

        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.5;
      
        this.jumpSound.onerror = () => console.error('Error loading jump sound');
        this.collectBoneSound.onerror = () => console.error('Error loading collect bone sound');
        this.backgroundMusic.onerror = () => console.error('Error loading background music');
        this.winSound.onerror = () => console.error('Error loading win sound');
        this.failure.onerror = () => console.error('Error loading failure sound');
     
       document.addEventListener('click', () => this.startMusic(), { once: true });
       document.addEventListener('keydown', () => this.startMusic(), { once: true });
    

      this.startGame();
      }
  }
  //za da zapocne pozadinskata muzika
  startMusic = () => {
    this.backgroundMusic.play().catch(err => console.error('Failed to play background music:', err));
  };
  
  //pritiskanje na kopcinja za dvizenje 
  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (!this.isBrowser) return;
    
    event.preventDefault();
    
    switch (event.key) {
      case 'ArrowLeft':
       
        this.dogPosition.x = Math.max(0, this.dogPosition.x - 20);
        this.isMovingLeft = true;
        this.isMovingRight = false;
        break;
      case 'ArrowRight':
        this.dogPosition.x = Math.min(window.innerWidth - 60, this.dogPosition.x + 20);
        this.isMovingLeft = false;
        this.isMovingRight = true
        break;
      case ' ':
      
      if (!this.isJumping) {
        this.jump();
      }
        break;
    }
  }
//pocetok na igra
  startGame() {
    this.backgroundMusic.play();
    this.isGameActive = true;
    setInterval(() => this.updateGame(), 20);
    

  }
//skokanje
jump() {
  if (!this.isJumping) {
    this.isJumping = true;
    this.velocityY = -this.jumpStrength;  
  
    if (this.isMovingRight && this.dogPosition.x < window.innerWidth - 50) {
      this.velocityX = this.horizontalSpeed;  
    } else if (this.isMovingLeft && this.dogPosition.x > 0) {
      this.velocityX = -this.horizontalSpeed;  
    } else {
      this.velocityX = 0;  
    }
    this.jumpSound.play();  
  }
}
//updejtiranje na igrata za proverka
  updateGame() {
    if (!this.isGameActive) return;
  
    const groundLevel = window.innerHeight - 280; 
    const maxJumpHeight = groundLevel - 400; 
     

    if (this.dogPosition.y < groundLevel || this.isJumping) {
      this.velocityY += this.gravity;  
      this.dogPosition.y += this.velocityY; 
  
      if (this.dogPosition.y > groundLevel) {
        this.dogPosition.y = groundLevel;
        this.velocityY = 0;
        this.isJumping = false;
      }
  
      if (this.dogPosition.y < maxJumpHeight) {
        this.dogPosition.y = maxJumpHeight;
        this.velocityY = 0;  
      }
    }
   
    this.checkPlatformCollision();
    this.checkCollisions();
  }
//proverka dali kuceto e na platforma 
  checkPlatformCollision() {
    let isOnAnyPlatform = false;

    this.platforms.forEach((platform) => {
      const dogBottom = this.dogPosition.y + 80;
      const dogTop = this.dogPosition.y;
      const dogLeft = this.dogPosition.x;
      const dogRight = this.dogPosition.x + 50;

      const platformTop = platform.y;
      const platformLeft = platform.x;
      const platformRight = platform.x + platform.width;

      if (dogRight > platformLeft && dogLeft < platformRight) {
        
        if (dogBottom >= platformTop && dogTop <= platformTop && this.velocityY > 0) {
          this.dogPosition.y = platformTop - 80;
          this.velocityY = 0;
          this.isJumping = false;
          isOnAnyPlatform = true;
        }
      }
    });

    this.isOnPlatform = isOnAnyPlatform;
  }
//za dopir so koska i so kukjata
checkCollisions() {
  this.bones = this.bones.filter((bone) => {
    if (this.dogPosition.y + this.dogPosition.height >= bone.y &&
        this.dogPosition.y + this.dogPosition.height <= bone.y + bone.height &&
        this.dogPosition.x + 10 < bone.x + bone.width &&
        this.dogPosition.x + this.dogPosition.width - 10 > bone.x) {
      
      this.collectBone(); 
      return false;  
    }
    return true;
  });

  if (this.checkCollision(this.dogPosition, { 
      x: this.house.x, 
      y: this.house.y, 
      width: this.house.width, 
      height: this.house.height 
    })) {
    if (this.collectedBones === this.platforms.length) {
      this.backgroundMusic.pause(); 

      this.showVictoryMessage();  
    } else {
      this.showIncompleteMessage(); 
    }
  }
}
//pokazuva popup deka ne se sobrani site koski
showIncompleteMessage() {
  this.failure.play();

  alert('Не ги имаш собрано сите коски! Продолжи да собираш!');
 
  this.moveDogAwayFromHouse();  
}
//go pomestuva kuceto malku polevo za da ne se aktivira nasekoe funckcijata za dopir so kukjata
moveDogAwayFromHouse() {
  this.dogPosition.x -= 50;  
}
//popup deka se sobrani site koski i pobeda na igrata 
showVictoryMessage() {
  this.winSound.play();

  alert('Честитки, победи!');
  this.moveDogAwayFromHouse();
  this.showRestartButton();  
 this.isGameOver = true; 
}
//otkako sme ja pobedile igrata se pojavuva kopce za restart
showRestartButton() {
  if (document.getElementById('restartButton')) return;
  console.log('Додаваме копче за рестарт!');
  const restartButton = document.createElement('button');
  restartButton.innerText = 'Рестартирај ја играта?';

   restartButton.id="restartButton";
   restartButton.style.position = 'fixed';
   restartButton.style.top = '30%';               
   restartButton.style.left = '50%';              
   restartButton.style.transform = 'translate(-50%, -50%)';
   restartButton.style.padding = '20px 40px';
   restartButton.style.fontSize = '24px';
   restartButton.style.backgroundColor = 'red';   
   restartButton.style.color = 'yellow';          
   restartButton.style.border = '2px solid black';
   restartButton.style.borderRadius = '15px';
   restartButton.style.zIndex = '9999';
   restartButton.style.cursor = 'pointer';

  restartButton.onclick = () => this.restartGame();  
  document.body.appendChild(restartButton);
}
//se restartira igrata ako sme go kliknale kopceto za restart
restartGame() {

  window.location.reload();
}
//dopir na dvata objekti
checkCollision(object1: { x: number; y: number; width: number; height: number }, 
               object2: { x: number; y: number; width: number; height: number }) {
  return (
    object1.x < object2.x + object2.width &&
    object1.x + object1.width > object2.x &&
    object1.y < object2.y + object2.height &&
    object1.y + object1.height > object2.y
  );
}
//se sobira koska
  collectBone() {
    this.collectedBones++;
    console.log('Собрана е коска! Вкупно коски:', this.collectedBones);
    this.collectBoneSound.play();  
  }
  @HostListener('window:keyup', ['$event'])
  handleKeyup(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      this.velocityX = 0;  
    }
  }
}