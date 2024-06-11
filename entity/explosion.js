export class Explosion {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width*2.5;
        this.height = height*2.5;
        this.frameDuration = 40; 
        this.currentFrame = 0;
        this.startTime = null;  // Définir le startTime à null
        this.initaltimestamp =  Date.now()
        this.finished = false;
        this.images = [];
        this.imagesLoaded = 0;
        for (let i = 1; i <= 10; i++) {
            const img = new Image();
            img.onload = () => {
                this.imagesLoaded++;
            };
            img.src = `../assets/explosion/Explosion_${i}.png`;
            this.images.push(img);
        }
    }

    update( context) {
        if (this.finished) return;  // Initialiser startTime si ce n'est pas déjà fait
        const elapsedTime =  Date.now() - this.initaltimestamp;
        this.currentFrame = Math.floor(elapsedTime / this.frameDuration);
        if (this.currentFrame >= this.images.length) {
            this.finished = true;
            this.currentFrame = this.images.length - 1;  // S'assurer que l'indice ne dépasse pas
        }

        this.draw(context);
    }

    draw(context) {
        if (this.imagesLoaded === this.images.length) {
            let image = this.images[this.currentFrame];
            context.drawImage(image, this.x, this.y, this.width, this.height);
        }
    }
}