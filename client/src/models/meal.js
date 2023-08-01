export class Meal {

    constructor(meal) {
        this.id = null
        this.date = null
        this.description = null
        this.orderItems = []
        this.ownerId = null
        Object.assign(this, meal)
    }

}