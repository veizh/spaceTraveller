export class Bullet {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        
        this.img=new Image()
        this.img.src="../assets/player/laserBlue01.png"
    }

    update(ctx) {
        this.y -= this.speed; // Les balles se déplacent vers le haut
        this.draw(ctx)
    }

    draw(ctx) {
        ctx.drawImage(this.img,this.x, this.y,this.width, this.height);
    }
}