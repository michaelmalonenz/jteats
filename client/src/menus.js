import { inject } from 'aurelia-framework'
import { DialogService } from 'aurelia-dialog'
import { MenuService } from './services/menu'
import { MenuSectionService } from './services/menu_section_service'
import { MenuEditor } from './dialogs/menu-editor'
import { MenuSectionEditor } from './dialogs/menu-section-editor'
import { MenuSection } from './models/menu_section'

@inject(DialogService, MenuService, MenuSectionService)
export class Menus {

  constructor(dialogService, menuService, menuSectionService) {
    this.dialogService = dialogService
    this.menuService = menuService
    this.menuSectionService = menuSectionService
    this.menus = []
    this.selectedMenu = null
    this.selectedSection = null
  }

  async activate () {
    this.menus = await this.menuService.getAll()
    if (this.menus.length) {
      this.selectedMenu = this.menus[0]
    }
  }

  createMenu () {
    this.dialogService.open({
      viewModel: MenuEditor,
      model: null,
      lock: true
    }).whenClosed(async (response) => {
      if (!response.wasCancelled) {
        const menu = await this.menuService.create(response.output)
        this.menus.push(menu)
      }
    })
  }

  editMenu (menu) {
    this.dialogService.open({
      viewModel: MenuEditor,
      model: menu,
      lock: true
    }).whenClosed(async (response) => {
      if (!response.wasCancelled) {
        const updated = await this.menuService.update(response.output)
        Object.assign(menus, updated)
      }
    })
  }

  selectMenu (menu) {
    this.selectedMenu = menu
  }

  addSection () {
    this.dialogService.open({
      viewModel: MenuSectionEditor,
      model: {
        menuId: this.selectedMenu.id,
        section: null,
      },
      lock: true,
    }).whenClosed(async (response) => {
      if (!response.wasCancelled) {
        const section = await this.menuSectionService.create(response.output)
        this.selectedMenu.menuSections.push(section)
      }
    })
  }

  editSection (section) {
    this.dialogService.open({
      viewModel: MenuSectionEditor,
      model: {
        menuId: this.selectedMenu.id,
        section: section,
      },
      lock: true,
    }).whenClosed(async (response) => {
      if (!response.wasCancelled) {
        const updated = await this.menuSectionService.update(response.output)
        Object.assign(section, updated)
      }
    })
  }

  selectSection (section) {
    this.selectedSection = section
  }

}