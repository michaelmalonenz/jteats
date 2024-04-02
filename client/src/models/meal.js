export class Meal {

    constructor(meal) {
        this.id = null
        this.date = null
        this.description = null
        this.orders = []
        this.ownerId = null
        this.mealId = null
        Object.assign(this, meal)
    }

}