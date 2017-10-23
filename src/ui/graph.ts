import NetworkJson from '../network'

abstract class Ui<T> {
  constructor(public data: T) {}

  abstract render(el: Element | string)

  abstract setData(data: any)
}

export default Ui
