import { bindable, customElement, inject } from 'aurelia-framework'
import { OrderItem } from '../models/order_item'
import { OrderItemService } from '../services/order_item_service'
import { AuthorizeStep } from '../security/authorise'

@inject(OrderItemService)
@customElement('meal-menu-section')
export class MealMenuSection {
    @bindable meal = null
    @bindable section = null
    expanded = false

    constructor (orderItemService) {
        this.orderItemService = orderItemService
    }

    toggleExpand () {
        this.expanded = !this.expanded
    }

    async addToOrder (event, item) {
        event.stopPropagation()
        const order = new OrderItem({
            userId: AuthorizeStep.user.id,
            mealId: this.meal.id,
            menuItemId: item.id,
            quantity: 1,
        })
        const newOrder = await this.orderItemService.addOrderItem(order)
    }
}