import { bindable } from 'aurelia-framework'

@bindable('user')
@bindable({
  name: 'avatarOnly',
  attribute: 'avatar-only',
  defaultValue: false
})
export class UserDisplay {
    constructor (user) {
        this.user = user
        this.model = user
    }

    get id () {
        return this.model.id
    }

    matches(other) {
        return other.user?.id === this.user.id
    }
}
