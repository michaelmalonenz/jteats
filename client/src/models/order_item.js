export class OrderItem {
    constructor (item) {
        this.id = null
        this.menuItemId = null
        this.quantity = 0
        this.menuItem = null
        this.notes = null
        Object.assign(this, item)
    }
}