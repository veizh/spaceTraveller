import { Asteroid } from "./entity/asteroid.js"
import { Bomb } from "./entity/bomb.js";
import { Explosion } from "./entity/explosion.js"
import { pill } from "./entity/pill.js";
import { superGun } from "./entity/supergun.js";
import { Player } from "./player/class.js"
import { modalText } from "./utils.js";

export class Game {
    constructor(ctx){
        this.score=0
        this.ctx=ctx
        this.player = new Player(window.innerWidth/2,window.innerHeight/2,80,80)
        this.asteroids = []
        this.explosions = [];
        this.items = []
        this.init()
        this.isGameOver = false;

            }
    init(){
        this.addAsteroid()
        this.addItems()
    }        
   addAsteroid() {
    const spawnAsteroid = () => {
        let x = Math.random() * (window.innerWidth - 80);
        let y = -80;
        let speed = Math.random() * 12 + 1 + this.score / 2000; // Augmente la vitesse en fonction du score
        let asteroid = new Asteroid(x, y, 80, 80, Math.random()*10, speed);
        this.asteroids.push(asteroid);

        let spawnInterval = Math.max(100, 500 - this.score / 10);

        setTimeout(spawnAsteroid, Math.random() * spawnInterval + spawnInterval / 2);
    };

    spawnAsteroid();
}
    addItems(){
        setInterval(()=>{
            let randomInt=Math.floor(Math.random()*3)
            console.log(randomInt);
            switch (randomInt) {
                case 0:
                    let ammo = new superGun(window.innerWidth/2,window.innerHeight/2,10,20,Math.floor(Math.random()*10),this.score/2000)
                    this.items.push(ammo)
                    
                    break;
                case 1:
                     let life = new pill(window.innerWidth/2,window.innerHeight/2,10,20,Math.floor(Math.random()*10),this.score/2000)
                     this.items.push(life)
                    
                    break;
                case 2:
                        let nuke = new Bomb(window.innerWidth/2,window.innerHeight/2,10,20,Math.floor(Math.random()*10),this.score/2000)
                        this.items.push(nuke)
                       
                       break;
                default:
                    break;
            }
        },10000)
    }
    draw(){
        
        this.player.draw(this.ctx)
        this.asteroids.forEach(e=>e.update(this.ctx))
    }
    
    updateScoreBoard(){
        this.score+=10

        document.querySelector('.score').innerHTML="Distance: "+this.score
        document.querySelector('.life').innerHTML="Life: "+this.player.life
    }
    update(){
        this.updateScoreBoard()
        this.ctx.clearRect(0,0,window.innerWidth,window.innerHeight)
        this.items.forEach(item => item.update(this.ctx));
        this.explosions.forEach(explosion => explosion.update(this.ctx));
        this.asteroids.forEach(e=>e.update(this.ctx))
        this.checkCollisions()
        this.player.update(this.ctx)

    }
    createExplosion(x, y, width, height,sounds) {
        if(sounds){
            
        const explosionSound2 = new Audio('../assets/sonore/explosion2.mp3');
        explosionSound2.currentTime = 0.15;
        explosionSound2.play()

        }
        const explosion = new Explosion(x, y, width, height); // Vous pouvez ajuster les paramètres
        this.explosions.push(explosion);
    }
    checkCollisions() {
        this.asteroids.forEach((asteroid,i) => {
            // Logique pour gérer la collision (par exemple, terminer le jeu ou réduire la vie)
            if(asteroid.y>window.innerHeight+200){
                this.asteroids.splice(i, 1);
            }
            if (this.isColliding(this.player, asteroid)) {
                console.log('Collision detected on asteroid '+i);
                this.asteroids.splice(i, 1);
                this.player.life-=1
                if(this.player.life<=0){
                    this.isGameOver=true
                    this.ctx.clearRect(0,0,window.innerWidth,window.innerHeight)
                    document.querySelector('.container__score').style.display="none"
                    document.querySelector('.displayScore').innerHTML=this.score
                    console.log('====================================');
                    console.log("GAME OVER");
                    console.log('====================================');
                }
                
            }

        });
        this.items.forEach((item, i) => {
            if (this.isColliding(this.player, item)) {
                console.log('Item collected!');
                switch (item.name) {
                    case "superGun":
                        this.player.getSuperGun()
                        break;
                    case "pill":
                        this.player.life+=1
                        modalText("+1 life")
                        break;
                    case "bomb":
                             this.asteroids=[]
                                let explosionSound = new Audio("../assets/sonore/explosion.mp3")
                                explosionSound.currentTime=1.2
                                explosionSound.play()
                                this.asteroids.splice(i, 1);
                            
                            
                        
                        modalText("un peu de répit")
                        break;
                    default:
                        break;
                }
                this.items.splice(i, 1);
                // Ajouter la logique pour l'effet de l'item, par exemple augmenter la vie ou le score
            }
        });
        for (let i = this.asteroids.length - 1; i >= 0; i--) {
            for (let j = this.player.bullets.length - 1; j >= 0; j--) {
                if (this.isColliding(this.player.bullets[j], this.asteroids[i])) {
                    console.log('Collision detected between bullet and asteroid!');
                    this.player.bullets.splice(j, 1);
                    this.asteroids[i].life--
                    if(this.asteroids[i].life<=0) {
                        this.createExplosion(this.asteroids[i].x-this.asteroids[i].width/2,this.asteroids[i].y-this.asteroids[i].height/2,this.asteroids[i].width,this.asteroids[i].height,true)
                        this.asteroids.splice(i, 1)
                        ;}
                    break; // Sortir de la boucle des balles car l'astéroïde a été supprimé
                }
            }
        }
        
    
    }

    isColliding(entityA, entityB) {
        return (
            entityA.x < entityB.x + entityB.width*0.9 &&
            entityA.x + entityA.width*0.9 > entityB.x &&
            entityA.y < entityB.y + entityB.height*0.9 &&
            entityA.y + entityA.height*0.9 > entityB.y
        );
    }
    restart() {
        this.player = null
        this.isGameOver = false;
        this.player = new Player(window.innerWidth/2,window.innerHeight/2,80,80);
        this.asteroids = [];
        this.items = [];
        this.explosions=[]
        this.score=0
    }
}