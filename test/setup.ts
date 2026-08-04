const localStorageMock = {
  store: {} as Record<string, string>,
  getItem(key: string) {
    return Object.hasOwn(this.store, key) ? this.store[key] : null
  },
  setItem(key: string, value: string) {
    this.store[key] = String(value)
  },
  removeItem(key: string) {
    delete this.store[key]
  },
  clear() {
    this.store = {}
  },
  key(index: number) {
    return Object.keys(this.store)[index] ?? null
  },
  get length() {
    return Object.keys(this.store).length
  },
}

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
})
