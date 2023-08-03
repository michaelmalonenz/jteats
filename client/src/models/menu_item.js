export class MenuItem {
    constructor (item) {
        this.id = null
        this.name = ''
        this.description = ''
        this.price = 0
        this.menuSectionId = null
        Object.assign(this, item)
    }
}