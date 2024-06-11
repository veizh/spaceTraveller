import { Entity } from "./class.js"

export class pill extends Entity{
    constructor(x,y,width,height,random,speed){
        super(x,y,width,height)
        this.name="pill"
        this.x = Math.floor(Math.random()*window.innerWidth*0.5)+Math.floor(window.innerWidth*0.25)
        this.y = -80
        this.vX = Math.floor(Math.random()*10)-5
        this.vY = 2
        this.height= 32
        this.width= 32
        this.rotation=0
        this.vR=Math.floor(Math.random()*4)-2
        this.img = new Image()
        this.img.src="../assets/items/pill_green.png"
        this.life=1
    }

    update(ctx){
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