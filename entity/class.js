export class Entity {
    constructor( ) {
        
        this.x = Math.floor(Math.random()*window.innerWidth)
        this.y = -5
    }

    update() {
        // Méthode à surcharger par les classes enfants
    }

    draw(ctx) {
        // Méthode à surcharger par les classes enfants
    }

    // Ajoutez d'autres méthodes communes aux entités si nécessaire
}