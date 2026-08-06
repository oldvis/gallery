import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import TheViewEntries from '~/components/TheViewEntries.vue'
import { useStore as useSelectorStore } from '~/stores/selector'
import { useStore as useVisStore } from '~/stores/visualization'
import { makeVisualization } from '../fixtures/visualizations'
import { createTestPinia } from '../helpers/pinia'

const mountEntries = async (count: number) => {
  const pinia = createTestPinia()
  const visStore = useVisStore()
  visStore.visualizations = Array.from({ length: count }, (_, i) => (
    makeVisualization({ uuid: `v${i}`, displayName: `Entry ${i}` })
  ))
  const wrapper = mount(TheViewEntries, {
    global: {
      plugins: [pinia],
      stubs: {
        VDataEntry: {
          props: ['datum', 'index'],
          template: '<div data-testid="entry-stub">{{ index }}</div>',
        },
      },
    },
  })
  await flushPromises()
  return { wrapper, visStore, selectorStore: useSelectorStore() }
}

describe('theViewEntries paging', () => {
  beforeEach(() => {
    createTestPinia()
  })

  it('shows Previous disabled and Next enabled on the first page', async () => {
    const { wrapper } = await mountEntries(45)
    const prev = wrapper.get('[data-testid="entries-previous"]')
    const next = wrapper.get('[data-testid="entries-next"]')
    expect(prev.attributes('disabled')).toBeDefined()
    expect(next.attributes('disabled')).toBeUndefined()
    expect(wrapper.get('[data-testid="entries-position"]').text()).toBe('1–20 / 45')
  })

  it('next advances the window; Previous goes back', async () => {
    const { wrapper } = await mountEntries(45)
    await wrapper.get('[data-testid="entries-next"]').trigger('click')
    expect(wrapper.get('[data-testid="entries-position"]').text()).toBe('21–40 / 45')
    await wrapper.get('[data-testid="entries-next"]').trigger('click')
    expect(wrapper.get('[data-testid="entries-position"]').text()).toBe('41–45 / 45')
    expect(wrapper.get('[data-testid="entries-next"]').attributes('disabled')).toBeDefined()
    await wrapper.get('[data-testid="entries-previous"]').trigger('click')
    expect(wrapper.get('[data-testid="entries-position"]').text()).toBe('21–40 / 45')
  })

  it('does not render Show 20 More', async () => {
    const { wrapper } = await mountEntries(45)
    expect(wrapper.text()).not.toContain('Show 20 More')
  })

  it('resets to the first page when matched results change', async () => {
    const { wrapper, selectorStore } = await mountEntries(45)
    await wrapper.get('[data-testid="entries-next"]').trigger('click')
    expect(wrapper.get('[data-testid="entries-position"]').text()).toBe('21–40 / 45')
    selectorStore.addSearchSelector('Entry 0')
    await flushPromises()
    const pos = wrapper.get('[data-testid="entries-position"]').text()
    expect(pos.startsWith('1')).toBe(true)
    expect(wrapper.get('[data-testid="entries-previous"]').attributes('disabled')).toBeDefined()
  })

  it('passes global indices into entry stubs', async () => {
    const { wrapper } = await mountEntries(45)
    await wrapper.get('[data-testid="entries-next"]').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="entry-stub"]').text()).toBe('21')
  })
})
