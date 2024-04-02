export class Order {
    constructor (order) {
        this.id = null
        this.mealId = null
        this.userId = null
        this.orderItems = []
        Object.assign(this, order)
    }
}