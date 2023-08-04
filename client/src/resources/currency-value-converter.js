export class CurrencyValueConverter {
  toView(value) {
    return `$${Number.parseFloat(value).toFixed(2)}`
  }

  fromView(value) {
    return value
  }
}
