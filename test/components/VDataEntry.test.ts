import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import VDataEntry from '~/components/VDataEntry.vue'
import { makeVisualization } from '../fixtures/visualizations'
import { createTestPinia } from '../helpers/pinia'

const mountEntry = (datum: ReturnType<typeof makeVisualization>) => {
  const pinia = createTestPinia()
  return mount(VDataEntry, {
    props: { datum },
    global: {
      plugins: [pinia],
      stubs: { VObjectInspector: true },
    },
  })
}

describe('vDataEntry image fallback', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('shows a loading spinner until the image loads', async () => {
    const wrapper = mountEntry(makeVisualization({
      uuid: 'v1',
      downloadUrl: 'https://example.com/img.png',
    }))

    expect(wrapper.text()).toContain('Loading image')
    expect(wrapper.find('img').exists()).toBe(true)
    await wrapper.find('img').trigger('load')
    expect(wrapper.text()).not.toContain('Loading image')
  })

  it('shows a textual fallback when the image fails to load', async () => {
    const wrapper = mountEntry(makeVisualization({
      uuid: 'v1',
      downloadUrl: 'https://example.com/img.png',
      viewUrl: 'https://example.com/view',
    }))

    expect(wrapper.find('img').exists()).toBe(true)
    await wrapper.find('img').trigger('error')
    expect(wrapper.text()).toContain('Image failed to load')
    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('explains HTTP-only images instead of rendering them', () => {
    const wrapper = mountEntry(makeVisualization({
      uuid: 'v1',
      downloadUrl: 'http://example.com/img.png',
    }))

    expect(wrapper.text()).toContain('served over HTTP')
    expect(wrapper.find('img').exists()).toBe(false)
  })
})
