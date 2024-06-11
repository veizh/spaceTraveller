import { Entity } from "./class.js";

export class Asteroid extends Entity{
    constructor(x,y,width,height,random,speed){
        super(x,y,width,height)
        this.x = x
        this.y = -80
        this.vX = Math.floor(Math.random()*50)-25
        this.vY = speed/2
        this.height= this.width= Math.floor(Math.random()*100)+20
        this.rotation=0
        this.vR=Math.floor(Math.random()*4)-2
        this.img = new Image()
        this.img.src=random<5?"../assets/meteor/meteorBrown_big1.png":"../assets/meteor/meteorGrey_big1.png"
        this.life=1
    }

    update(ctx){
        if(this.vy>100)this.vy=100
        this.y+=this.vY
        this.x+=this.vX*0.1
        this.rotation+=this.vR*0.002
        
        ctx.save(); // Sauvegarde l'état du contexte
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2); // Translation au centre de l'image
        ctx.rotate( Math.PI *this.rotation); // Rotation de 45 degrés (PI/4 radians)
        ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height); // Dessin de l'image
        ctx.restore(); // Restaure l'état du contexte
        this.draw(ctx)
    }
}