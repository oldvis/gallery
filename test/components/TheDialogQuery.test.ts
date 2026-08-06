import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import TheDialogQuery from '~/components/TheDialogQuery.vue'
import { useStore } from '~/stores/selector'

const mountDialog = () => {
  const pinia = createPinia()
  setActivePinia(pinia)
  return {
    wrapper: mount(TheDialogQuery, {
      global: { plugins: [pinia], stubs: { teleport: true } },
    }),
    store: useStore(),
  }
}

describe('theDialogQuery', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('shows an error and does not add selectors when Apply has no complete rows', async () => {
    const { wrapper, store } = mountDialog()
    await wrapper.get('[data-testid="query-open"]').trigger('click')
    await wrapper.get('[data-testid="query-apply"]').trigger('click')
    expect(wrapper.text()).toContain('Complete every filter before Apply.')
    expect(store.selectors).toHaveLength(0)
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
  })

  it('applies a field row as an equality selector and closes', async () => {
    const { wrapper, store } = mountDialog()
    await wrapper.get('[data-testid="query-open"]').trigger('click')
    await wrapper.get('[data-testid="query-row-field"]').trigger('click')
    await wrapper.get('[data-testid="query-row-field-option-authors"]').trigger('click')
    await wrapper.get('[data-testid="query-row-value"]').setValue('Playfair, William')
    await wrapper.get('[data-testid="query-apply"]').trigger('click')
    expect(store.selectors).toHaveLength(1)
    expect(store.selectors[0].query).toEqual({
      authors: { $eq: 'Playfair, William' },
    })
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('cancel discards draft without mutating selectors', async () => {
    const { wrapper, store } = mountDialog()
    await wrapper.get('[data-testid="query-open"]').trigger('click')
    await wrapper.get('[data-testid="query-row-value"]').setValue('x')
    await wrapper.get('[data-testid="query-cancel"]').trigger('click')
    expect(store.selectors).toHaveLength(0)
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })
})
