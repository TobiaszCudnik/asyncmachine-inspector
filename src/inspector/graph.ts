import NetworkJson from '../network/network'

abstract class Ui<T> {
  constructor(public data: T) {}

  abstract render(el: Element | string)

  abstract setData(data: any)

  abstract tmpHighlight(
    ids: string[],
    persistent: number | boolean
  ): void | (() => void)[]

  abstract scrollTo(id: string)

  // TODO updateCells
}

export default Ui
