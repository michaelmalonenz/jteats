export class Menu {
    constructor (menu) {
        this.id = null
        this.restaurant = null
        this.description = null
        this.sections = []
        Object.assign(this, menu)
    }
}