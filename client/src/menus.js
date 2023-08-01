import { inject } from 'aurelia-framework'
import { DialogService } from 'aurelia-dialog'
import { MenuService } from './services/menu'
import { MenuEditor } from './dialogs/menu-editor'

@inject(DialogService, MenuService)
export class Menus {

  constructor(dialogService, menuService) {
    this.dialogService = dialogService
    this.menuService = menuService
    this.menus = []
  }

  async activate() {
    this.menus = await this.menuService.getAll()
  }

  createMenu() {
    this.dialogService.open({
      viewModel: MenuEditor,
      model: {},
      lock: true
    }).whenClosed(async (response) => {
      if (!response.wasCancelled) {
        const menu = await this.menuService.create(response.output)
        this.menus.push(menu)
      }
    })
  }

}