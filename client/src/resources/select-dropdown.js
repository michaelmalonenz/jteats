import {customElement, bindable, bindingMode} from 'aurelia-framework'
import { isEmpty } from '../utils/functions';

@bindable('options')
@bindable({
  name: 'value',
  defaultBindingMode: bindingMode.twoWay
})
@customElement('select-dropdown')
export class SelectDropDown {

  constructor () {
    this.active = false
    this.selected = null

    this.boundOptionClicked = this.optionClicked.bind(this)
  }

  bind () {
    if (this.value != null) {
      this.selected = this.options.find(o => o.matches(this.value))
    }
  }

  optionClicked (event, option) {
    if (event) {
      event.stopPropagation();
    }
    if (option) {
      this.selected = option
      this.value = option.model
    }
    this.active = !this.active
    if (this.active) {
      this._addDeactivateListeners()
    } else {
      this._removeDeactivateListeners()
    }
  }

  valueChanged (newValue, oldValue) {
    if (!newValue || isEmpty(newValue)) {
      this.selected = null
    }
  }

  _addDeactivateListeners () {
    document.addEventListener('click', this.boundOptionClicked)
  }

  _removeDeactivateListeners () {
    document.removeEventListener('click', this.boundOptionClicked)
  }

}
