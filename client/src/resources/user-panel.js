import { customElement, computedFrom } from 'aurelia-framework'
import { AuthorizeStep } from '../security/authorise'

@customElement('user-panel')
export class UserPanel {

  showDropdown = false

  constructor () {
    this.boundToggleDropdown = this.toggleDropdown.bind(this)
  }

  @computedFrom('currentUser')
  get loggedIn() {
    return this.currentUser != null
  }

  get currentUser () {
    return AuthorizeStep.user
  }

  toggleDropdown () {
    this.showDropdown = !this.showDropdown
    if (this.showDropdown) {
      document.addEventListener('click', this.boundToggleDropdown)
    } else {
      document.removeEventListener('click', this.boundToggleDropdown)
    }
  }
}
