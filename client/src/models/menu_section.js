export class MenuSection {
    constructor (menuSection) {
        this.id = null
        this.description = null
        this.menuId = null
        this.menuItems = []
        Object.assign(this, menuSection)
    }
}