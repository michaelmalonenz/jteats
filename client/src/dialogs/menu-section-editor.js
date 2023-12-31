import { inject, DOM, NewInstance } from 'aurelia-framework'
import { DialogController } from 'aurelia-dialog'
import { ValidationController, ValidationRules } from 'aurelia-validation'
import { MenuSectionService } from '../services/menu_section_service'

@inject(DialogController, NewInstance.of(ValidationController), MenuSectionService, DOM.Element)
export class MenuSectionEditor {

    constructor (dialogController, ValidationController, menuSectionService, element) {
        this.controller = dialogController
        this.ValidationController = ValidationController
        this.menuSectionService = menuSectionService
        this.element = element
        this.name = ''
        this.description = ''
        this.menuId = null
        this.menuSectionId = null

        this.header = 'Add Menu Section'
        this.boundKeyDown = this.keydown.bind(this)
    }

    activate (model) {
        this.menuId = model.menuId
        if (model.section) {
            this.header = 'Edit Menu Section'
            this.name = model.section.name
            this.description = model.section.description
            this.menuSectionId = model.section.id
        }
    }

    async save () {
      const result = await this.ValidationController.validate()
      if (result.valid) {
        this.controller.ok({
          id: this.menuSectionId,
          menuId: this.menuId,
          name: this.name,
          description: this.description,
        })
      }
    }

    close () {
      this.controller.cancel()
    }

    async deleteMenuSection () {
      await this.menuSectionService.delete(this.menuId, this.menuSectionId)
      this.controller.cancel()
    }

    keydown (event) {
      if (event.key === 'Enter') {
        this.save()
      }
    }

    attached () {
      this.element.addEventListener('keydown', this.boundKeyDown)
    }

    detached () {
      this.element.removeEventListener('keydown', this.boundKeyDown)
    }
}

ValidationRules
  .ensure('name').displayName('Section Name').required()
  .on(MenuSectionEditor)