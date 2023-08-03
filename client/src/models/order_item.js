export class OrderItem {
    constructor (item) {
        this.userId = null
        this.menuItemId = null
        this.mealId = null
        this.quantity = 0
        Object.assign(this, item)
    }
}