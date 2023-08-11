import { inject, NewInstance } from 'aurelia-framework'
import { DialogService } from 'aurelia-dialog'
import { ValidationController, ValidationRules } from 'aurelia-validation'
import { MenuService } from './services/menu'
import { MenuSectionService } from './services/menu_section_service'
import { MenuEditor } from './dialogs/menu-editor'
import { MenuSectionEditor } from './dialogs/menu-section-editor'
import { MenuItem } from './models/menu_item'
import { MenuItemService } from './services/menu_item_service'

@inject(DialogService, MenuService, MenuSectionService, MenuItemService, NewInstance.of(ValidationController))
export class Menus {

  constructor(dialogService, menuService, menuSectionService, menuItemService, validationController) {
    this.dialogService = dialogService
    this.menuService = menuService
    this.menuSectionService = menuSectionService
    this.menuItemService = menuItemService
    this.validationController = validationController
    this.menus = []
    this.selectedMenu = null
    this.selectedSection = {}
    this.item = null

    this.validationRules = ValidationRules
      .ensure('name').required()
      .rules

    this.resetItem()
  }

  async activate () {
    this.menus = await this.menuService.getAll()
    if (this.menus?.length) {
      this.selectMenu(this.menus[0])
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
        Object.assign(menu, updated)
      }
    })
  }

  selectMenu (menu) {
    this.selectedMenu = menu
    if (this.selectedMenu.menuSections?.length) {
      this.selectedSection = this.selectedMenu.menuSections[0]
    } else {
      this.selectedSection = {}
    }
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
    this.resetItem()
  }

  async saveMenuItem () {
    const isNew = !this.item.id
    this.item.menuId = this.selectedMenu.id
    this.item.menuSectionId = this.selectedSection.id
    const result = await this.validationController.validate()
    if (result.valid) {
      if (isNew) {
        const newItem = await this.menuItemService.create(this.item)
        this.selectedSection.menuItems.push(newItem)
      } else {
        const updated = await this.menuItemService.update(this.item)
        const index = this.selectedSection.menuItems.findIndex((menuItem) => menuItem?.id === this.item.id)
        if (index !== -1) {
          Object.assign(this.selectedSection.menuItems[index], updated)
        }
      }
      this.resetItem()
    }
  }

  resetItem () {
    if (this.item) {
      this.validationController.removeObject(this.item)
    }
    this.item = new MenuItem()
    this.validationController.addObject(this.item, this.validationRules)
  }

  selectItem (item) {
    this.item = new MenuItem(item)
  }

  async deleteMenuItem () {
    await this.menuItemService.delete(this.selectedMenu.id, this.selectedSection.id, this.item.id)
    const index = this.selectedSection.menuItems.findIndex((menuItem) => menuItem?.id === this.item.id)
    if (index !== -1) {
      this.selectedSection.menuItems.splice(index, 1)
    }
    this.resetItem()
  }

}
