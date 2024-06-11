import { Entity } from "../entity/class.js";
import { modalText } from "../utils.js";
import { Bullet } from "./bullet.js";

export class Player extends Entity {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.width = 80;
    this.height = 80;
    
    this.frameDuration = 40; 
    this.currentFrame = 0;
    this.startTime = null;  // Définir le startTime à null
    this.initaltimestamp =  Date.now()
    this.x = window.innerWidth / 2 - this.width / 2;
    this.y = window.innerHeight * 0.85 - this.height / 2;
    this.img = new Image();
    this.img.src = "../assets/player/ship.png";
    this.images = []
    this.imagesLoaded = 0;
    for (let i = 1; i <= 6; i++) {
        const img = new Image();
        img.onload = () => {
            this.imagesLoaded++;
        };
        img.src = `../assets/player/flamme/Explosion_${i}.png`;
        this.images.push(img);
    }
    this.currentState=0;
    this.finished=false
    this.vX = 0;
    this.vY = 0;
    this.rotation = 0;
    this.life = 3;
    this.direction = "idle";
    this.superGunIsActive=false
    this.leftPressed = false;
    this.rightPressed = false;
    this.bullets = []; // Tableau pour stocker les balles
    this.init();
    this.isReloading = false;
  }
  update(ctx) {
    this.updateDirection();
    this.updatePosition();
    ctx.save(); // Sauvegarde l'état du contexte
    if (this.finished) this.currentFrame=0;  // Initialiser startTime si ce n'est pas déjà fait
        const elapsedTime =  Date.now() - this.initaltimestamp;
        this.currentFrame = Math.floor(elapsedTime / this.frameDuration)
        this.currentFrame++;
        if (this.currentFrame >= 5) {
            this.initaltimestamp=Date.now()
            this.finished = true;
            this.currentFrame = 0;  // S'assurer que l'indice ne dépasse pas
        }
        
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2); // Translation au centre de l'image
        ctx.rotate(Math.PI * this.rotation); // Rotation de 45 degrés (PI/4 radians)
    ctx.drawImage(
        this.images[this.currentFrame],
        -10,
        +this.height / 2 ,
        20,
        90
        )
        ctx.drawImage(
            this.img,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
            ); // Dessin de l'image
    ctx.restore(); // Restaure l'état du contexte
    this.draw(ctx);
    this.drawBullets(ctx);
  }
  handleKeyDown(event) {
    switch (event.key) {
      case "ArrowLeft":
      case "Q":
      case "q":
        this.leftPressed = true;
        break;
      case "ArrowRight":
      case "D":
      case "d":
        this.rightPressed = true;
        break;
      case "ArrowUp":
      case "Z":
      case "z":
        this.upPressed = true;
        break;
      case "ArrowDown":
      case "s":
      case "S":
        this.downPressed = true;
        break;
    }
  }

  handleKeyUp(event) {
    switch (event.key) {
      case "ArrowLeft":
      case "q":
      case "Q":
        this.leftPressed = false;
        break;
      case "ArrowRight":
      case "d":
      case "D":
        this.rightPressed = false;
        break;
      case "ArrowUp":
      case "z":
      case "Z":
        this.upPressed = false;
        break;
      case "ArrowDown":
      case "s":
      case "S":
        this.downPressed = false;
        break;
    }
  }

  updateDirection() {
    if (this.leftPressed && !this.rightPressed) {
      this.direction = "gauche";
      this.vX = -1;
    } else if (this.rightPressed && !this.leftPressed) {
      this.direction = "droite";
      this.vX = 1;
    } else {
      this.direction = "idle";
      this.vX = 0;
    }
    if (this.upPressed && !this.downPressed) {
      this.vY = -1.25;
    } else if (this.downPressed && !this.upPressed) {
      this.vY = 1.25;
    } else {
      this.vY = 0;
    }
  }

  updatePosition() {
    this.x += this.vX * 8;
    this.y += this.vY * 8;
    // Ajouter des limites horizontales
    const leftLimit = window.innerWidth * 0.05;
    const rightLimit = window.innerWidth * 0.95 - this.width;
    if (this.vX > 0 && this.rotation < 0.04) {
      this.rotation += 0.0015;
    }
    if (this.vX < 0 && this.rotation > -0.04) {
      this.rotation -= 0.0015;
    }
    if (this.vX === 0) {
      this.rotation = 0;
    }

    if (this.x < leftLimit) {
      this.x = leftLimit;
    }

    if (this.x > rightLimit) {
      this.x = rightLimit;
    }
    // Ajouter des limites verticales
    const topLimit = window.innerHeight * 0.1;
    const bottomLimit = window.innerHeight * 0.9 - this.height;

    if (this.y < topLimit) {
      this.y = topLimit;
    }
    if (this.y > bottomLimit) {
      this.y = bottomLimit;
    }
  }
  getSuperGun(){
    this.superGunIsActive=true
    modalText("unlimited ammo.q for 7s")
        
    setTimeout(()=>{
        this.superGunIsActive=false
        modalText("bonus ended")
    },7000)
  }
  shoot(e) {
      if (e.key !== " " || this.isReloading) return;
      let laserSound = new Audio("../assets/sonore/laser.mp3")
      laserSound.volume=0.3
      laserSound.currentTime=0
      laserSound.play()
    if(this.superGunIsActive){
      const bulletWidth = 5;
      const bullet = new Bullet(
        this.x + this.width / 2 - 10,
        this.y - 22,
        10,
        80,
        20
        
      );
      this.bullets.push(bullet);

      return
    }
    else{
        this.isReloading = true;
      const bulletWidth = 5;
      const bullet = new Bullet(
        this.x + this.width / 2 - 10,
        this.y - 22,
        20,
        80,
        20
      );
      this.bullets.push(bullet);
      setTimeout(() => {
        this.isReloading = false;
      }, 300);

    }
      
    
  }
  updateBullets() {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      this.bullets[i].update();
      // Supprime les balles qui sortent de l'écran
      if (this.bullets[i].y + this.bullets[i].height < 0) {
        this.bullets.splice(i, 1);
      }
    }
  }
  drawBullets(context) {
    this.bullets.forEach((bullet) => bullet.update(context));
  }
  // Ajoutez des écouteurs d'événements pour les touches enfoncées et relâchées
  init() {
    window.addEventListener("keydown", (e) => this.handleKeyDown(e));
    window.addEventListener("keyup", (e) => this.handleKeyUp(e));
    window.addEventListener("keydown", (e) => this.shoot(e));
  }
}
