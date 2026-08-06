import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import VHistogram from '~/components/VHistogram.vue'

const mountHistogram = (props: {
  data: number[]
  xDomain: [number, number]
  binStep: number
  yDomain?: [number, number]
}) => mount(VHistogram, {
  props: {
    width: 640,
    height: 400,
    ...props,
  },
})

const hitTargets = (wrapper: ReturnType<typeof mountHistogram>) => (
  wrapper.findAll('rect').filter((rect) => rect.attributes('style')?.includes('cursor: pointer'))
)

const fillHeights = (wrapper: ReturnType<typeof mountHistogram>) => (
  wrapper.findAll('g[fill] > g').map((group) => {
    const fill = group.findAll('rect')[0]
    return Number(fill.attributes('height'))
  })
)

describe('vHistogram binning', () => {
  it('puts the domain max into the last full-width bin', async () => {
    const wrapper = mountHistogram({
      data: [618, 1900, 1925, 1950],
      xDomain: [600, 1950],
      binStep: 50,
    })

    const hits = hitTargets(wrapper)
    expect(hits).toHaveLength(27)

    await hits[hits.length - 1].trigger('click')
    expect(wrapper.emitted('clickBar')?.at(-1)?.[0]).toEqual([1900, 1950])
  })

  it('uses (x0, x1] semantics for bar heights', () => {
    const leftEdgeOnly = mountHistogram({
      data: [1800],
      xDomain: [1800, 1850],
      binStep: 50,
      yDomain: [0, 2],
    })
    expect(fillHeights(leftEdgeOnly)).toEqual([0])

    const interiorValues = mountHistogram({
      data: [1801, 1850],
      xDomain: [1800, 1850],
      binStep: 50,
      yDomain: [0, 2],
    })
    expect(fillHeights(interiorValues)[0]).toBeGreaterThan(0)

    const hits = hitTargets(interiorValues)
    expect(hits).toHaveLength(1)
  })

  it('does not create a thin bin past the domain max', async () => {
    const wrapper = mountHistogram({
      data: [1950],
      xDomain: [1900, 1950],
      binStep: 50,
    })

    const hits = hitTargets(wrapper)
    expect(hits).toHaveLength(1)
    await hits[0].trigger('click')
    expect(wrapper.emitted('clickBar')?.[0]?.[0]).toEqual([1900, 1950])
  })
})
