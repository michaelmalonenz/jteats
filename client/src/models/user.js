export class User {

    constructor(user) {
        this.id = null
        this.externalId = null
        this.name = null
        this.nickname = null
        this.pictureUrl = null
        Object.assign(this, user)
    }

}