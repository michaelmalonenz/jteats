import { customElement, bindable, inject, computedFrom } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { OrderService } from '../services/order_service'
import { OrderItemService } from '../services/order_item_service'
import { ORDER_ADDED } from '../utils/events'

@inject(OrderService, OrderItemService, EventAggregator)
@customElement('meal-order')
export class MealOrder {

  @bindable meal = null

  constructor (orderService, orderItemService, eventAggregator) {
    this.orderService = orderService
    this.orderItemService = orderItemService
    this.eventAggregator = eventAggregator
    this.order = null
  }

  async bind () {
    this.orderItemAddedSub = this.eventAggregator.subscribe(ORDER_ADDED, this.orderAdded.bind(this))
    await this.mealChanged()
  }

  unbind () {
    this.orderItemAddedSub.dispose()
  }

  async mealChanged () {
    this.order = await this.orderService.getOrderForMeal(this.meal)
  }

  async completeOrder () {
    this.order.completed = true
    await this.orderService.update(this.meal, this.order)
  }

  async removeItem (item) {
    const result = await this.orderItemService.removeItemFromOrder(this.order, item)
    if (result == null) {
      const index = this.order.orderItems.indexOf(item)
      this.order.orderItems.splice(index, 1)
    } else {
      Object.assign(item, result)
    }
  }

  async orderAdded (item) {
    if (this.order == null) {
      this.order = await this.orderService.getOrderForMeal(this.meal)
    }
    const index = this.order.orderItems.findIndex(x => x.id == item.id)
    if (index === -1) {
      this.order.orderItems.push(item)
    } else {
      Object.assign(this.order.orderItems[index], item)
    }
  }
}
