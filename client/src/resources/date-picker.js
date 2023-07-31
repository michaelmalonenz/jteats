import { inject, customElement, bindable, bindingMode } from 'aurelia-framework'
import moment from 'moment'
import Pikaday from 'pikaday'

@bindable({
  name: 'value',
  defaultBindingMode: bindingMode.twoWay,
  defaultValue: new moment()
})
@bindable({
  name: 'maxDate',
  defaultValue: new moment(),
  attribute: 'max-date'
})
@bindable('label')
@bindable({
  name: 'disabled',
  defaultValue: false,
  defaultBindingMode: bindingMode.oneWay
})
@customElement('date-picker')
@inject(Element)
export class DatePicker {
  constructor (element) {
    this.element = element
    this.value = null
  }

  attached () {
    const elem = this.element.querySelector('.date-picker')
    this.picker = new Pikaday({
      field: elem,
      maxDate: this.maxDate.toDate(),
      toString: function (date, format) {
        const mo = new moment(date)
        return mo.format(format)
      },
      onSelect: () => {
        this.value = new moment(this.picker.getDate())
      }
    })
    this.picker.setDate(new moment(this.value).format('YYYY-MM-DD'))
  }

  detached () {
    this.picker.destroy()
  }
}

