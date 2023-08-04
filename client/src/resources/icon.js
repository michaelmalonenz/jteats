import { bindable, customElement, bindingMode } from 'aurelia-framework';

@bindable({
  name: 'category',
  defaultValue: 'fa',
  defaultBindingMode: bindingMode.oneTime
})
@bindable({
  name: 'icon',
  defaultValue: 'fa-edit',
  defaultBindingMode: bindingMode.oneTime
})
@customElement('icon')
export class Icon {
}
