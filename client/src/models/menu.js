export class Menu {
    constructor (menu) {
        this.id = null
        this.restaurant = null
        this.description = null
        this.menuSections = []
        Object.assign(this, menu)
    }
}