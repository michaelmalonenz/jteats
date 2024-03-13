import { EventAggregator } from 'aurelia-event-aggregator'
import { inject } from 'aurelia-framework'
import { io } from 'socket.io-client'
import { MEAL_CLOSED, ITEM_ORDERED, MEAL_REOPENED } from '../utils/events'

@inject(EventAggregator)
export class WebSocket {

    constructor (eventAggregator) {
        this.eventAggregator = eventAggregator
        this.socket = io()
        this.socket.on('meal_closed', this.mealClosed.bind(this))
        this.socket.on('item_ordered', this.itemOrdered.bind(this))
        this.socket.on('meal_reopened', this.mealReopened.bind(this))
    }

    mealClosed (arg) {
        this.eventAggregator.publish(MEAL_CLOSED, arg)
    }

    mealReopened (arg) {
        this.eventAggregator.publish(MEAL_REOPENED, arg)
    }

    itemOrdered (arg) {
        this.eventAggregator.publish(ITEM_ORDERED, arg)
    }

}