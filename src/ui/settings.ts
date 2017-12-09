export interface ISettings {
  logs_visible: boolean
  machines_visible: boolean
  positions: { id: string; x: number; y: number }[]
}

class LocalStorage {
  data: { [uri: string]: ISettings }
  constructor(public namespace = 'am-inspector', public uri: string) {
    if (!this.uri) {
      this.uri = window.location.pathname
    }
    const prev_data = localStorage.getItem(this.namespace)
    this.data = prev_data ? JSON.parse(prev_data) : { [this.uri]: {} }
    if (!this.data[this.uri]) {
      this.data[this.uri] = {}
    }
  }
  set(name: string, value) {
    this.data[name] = value
    this.save()
  }
  get(): ISettings {
    return this.data[this.uri]
  }
  save() {
    localStorage.setItem(this.namespace, JSON.stringify(this.data))
  }
}

export default LocalStorage
