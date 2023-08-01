export class Menu {
    constructor (menu) {
        this.id = null
        this.title = null
        this.sections = []
        Object.assign(this, menu)
    }
}