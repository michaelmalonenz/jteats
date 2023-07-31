export class Meal {

    constructor(meal) {
        this.id = null
        this.date = null
        this.description = null
        this.orderItems = []
        Object.assign(this, meal)
    }

}