import { DialogService } from 'aurelia-dialog'
import { inject, computedFrom } from 'aurelia-framework'
import { Router } from 'aurelia-router'
import { EventAggregator } from 'aurelia-event-aggregator'
import { MealEditor } from './dialogs/meal-editor'
import { MealService } from './services/meal'
import { MenuService } from './services/menu'
import { OrderService } from './services/order_service'
import { UserService } from './services/user'
import { AuthorizeStep } from './security/authorise'
import { OrderItem } from './models/order_item'
import { ITEM_ORDERED, MEAL_CLOSED, MEAL_REOPENED } from './utils/events'

@inject(DialogService, EventAggregator, Router, MealService, MenuService, UserService, OrderService)
export class Meals {
 
  constructor (dialogService, eventAggregator, router, mealService, menuService, userService, orderService) {
    this.dialogService = dialogService
    this.eventAggregator = eventAggregator
    this.router = router
    this.mealService = mealService
    this.menuService = menuService
    this.userService = userService
    this.orderService = orderService
    this.meals = []
    this.selectedMeal = null
    this.myOrderItems = []
    this.allOrderItems = []
    this.usersWithOrders = []
  }

  async activate (params) {
    this.meals = await this.mealService.getAll()
    if (params?.meal_id) {
      const meal = this.meals.find(x => x.id == params.meal_id)
      if (meal) {
        await this.selectMeal(meal)
        return
      }
    }
    if (this.meals?.length) {
      await this.selectMeal(this.meals[0])
    }
  }

  bind () {
    this.itemOrderedSub = this.eventAggregator.subscribe(ITEM_ORDERED, this.itemOrdered.bind(this))
    this.mealClosedSub = this.eventAggregator.subscribe(MEAL_CLOSED, this.mealClosed.bind(this))
    this.mealReopenedSub = this.eventAggregator.subscribe(MEAL_REOPENED, this.mealReopened.bind(this))
  }

  unbind () {
    this.mealReopenedSub.dispose()
    this.mealClosedSub.dispose()
    this.itemOrderedSub.dispose()
  }

  @computedFrom('selectedMeal')
  get mealOwner () {
    return this.selectedMeal && this.selectedMeal.ownerId === AuthorizeStep.user.id
  }

  @computedFrom('allOrderItems')
  get totalCost () {
    return this.allOrderItems.reduce((accumulator, orderItem) => {
      return accumulator + (orderItem.quantity * orderItem.menuItem.price)
    }, 0)
  }

  createMeal() {
    this.dialogService.open({
      viewModel: MealEditor,
      model: null,
      lock: true
    }).whenClosed(async (response) => {
      if (!response.wasCancelled) {
        const meal = await this.mealService.create(response.output)
        this.meals.unshift(meal)
        this.navigateToMeal(meal.id)
      }
    })
  }

  async editMeal (meal) {
    this.dialogService.open({
      viewModel: MealEditor,
      model: meal,
      lock: true
    }).whenClosed(async (response) => {
      if (!response.wasCancelled) {
        const updated = await this.mealService.update(response.output)
        Object.assign(meal, updated)
      }
    })
  }

  navigateToMeal (mealId) {
    this.router.navigateToRoute('meals', { meal_id: mealId })
  }

  async selectMeal (meal) {
    this.selectedMeal = meal
    this.menu = await this.menuService.getMenu(meal.menuId)
    if (meal.closed) {
      this.orders = await this.orderService.getOrdersForMeal(meal)
      this.allOrderItems = this.concatOrderItems(this.orders)
      this.aggregatedOrderItems = this.aggregateOrderItems(this.allOrderItems)
    } else {
      this.usersWithOrders = await this.userService.getUsersWithOrdersForMeal(meal.id)
    }
  }

  async closeOrders () {
    this.selectedMeal = await this.mealService.closeOrders(this.selectedMeal)
  }

  async reopenOrders () {
    this.selectedMeal = await this.mealService.reopenOrders(this.selectedMeal)
  }

  concatOrderItems (orders) {
    const result = []
    for (const order of orders) {
      result.concat(order.orderItems)
    }
    return result
  }

  aggregateOrderItems (orderItems) {
    const results = []
    for (const item of orderItems) {
      const result = results.find(x => x.menuItem.id == item.menuItem.id)
      if (result == null) {
        results.push(new OrderItem(item))
      } else {
        result.quantity += item.quantity
      }
    }
    return results
  }

  async itemOrdered (itemArg) {
    if (this.selectedMeal.id === itemArg.mealId) {
      this.usersWithOrders = await this.userService.getUsersWithOrdersForMeal(itemArg.mealId)
    }
  }

  mealClosed (mealArg) {
    if (this.selectedMeal.id === mealArg.mealId) {
      this.selectedMeal.closed = true
      this.selectMeal(this.selectedMeal)
    }
  }

  mealReopened (mealArg) {
    if (this.selectedMeal.id === mealArg.mealId) {
      this.selectedMeal.closed = false
      this.selectMeal(this.selectedMeal)
    }
  }
}