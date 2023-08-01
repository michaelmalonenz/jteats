import { inject, DOM, customAttribute } from 'aurelia-framework'

@customAttribute('focus-on-attach')
@inject(DOM.Element)
export class FocusOnAttach {

  constructor(element) {
    this.value = true
    this.element = element
  }

  attached(){
    if (this.value === '' || (this.value && this.value !== 'false')) {
      this.element.focus();
    }
  }
}