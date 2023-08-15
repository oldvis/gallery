import { acceptHMRUpdate, defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

export enum MessageType {
  Success = 'Success',
  Error = 'Error',
}

export interface Message {
  uuid: string
  content: string
  type: MessageType
  /** The timeout of the message in millisecond. */
  timeout: number
}

export const useStore = defineStore('message', {
  state: () => ({
    messages: [] as Message[],
  }),
  actions: {
    addMessage(content: string, type: MessageType, timeout: number): void {
      this.messages.push({
        uuid: uuidv4(),
        content,
        type,
        timeout,
      })
    },
    addSuccessMessage(content: string, timeout = 3000): void {
      this.addMessage(content, MessageType.Success, timeout)
    },
    addErrorMessage(content: string, timeout = 3000): void {
      this.addMessage(content, MessageType.Error, timeout)
    },
    removeMessage(uuid: string): void {
      const index = this.messages.findIndex((d) => d.uuid === uuid)
      this.messages.splice(index, 1)
    },
  },
  persist: true,
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot))
}
