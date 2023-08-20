import { customElement, computedFrom, inject } from 'aurelia-framework'
import { DialogService } from 'aurelia-dialog'
import { AuthorizeStep } from '../security/authorise'
import { UserSettings } from '../dialogs/user-settings'
import { UserService } from '../services/user'

@inject(DialogService, UserService)
@customElement('user-panel')
export class UserPanel {

  showDropdown = false

  constructor (dialogService, userService) {
    this.dialogService = dialogService
    this.userService = userService
    this.boundToggleDropdown = this.toggleDropdown.bind(this)
    this.settings = null
  }

  async activate () {
    this.settings = await this.userService.getUserSettings()
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

  async openSettings () {
    this.dialogService.open({
      viewModel: UserSettings,
      model: this.settings,
      lock: true,
    }).whenClosed(async (response) => {
      if (!response.wasCancelled) {
        await this.userService.saveUserSettings(response.output)
      }
    })
  }
}
