<script setup lang="ts">
import {
  axisBottom,
  axisLeft,
  format,
  scaleLinear,
  select,
  selectAll,
} from 'd3'
import { toRefs } from 'vue'

/** One histogram bin covering the open-closed interval (x0, x1]. */
interface OpenClosedBin extends Array<number> {
  x0: number
  x1: number
}

const props = defineProps({
  data: {
    type: Array as PropType<number[]>,
    required: true,
  },
  /** Fixed bin width in the same units as data (e.g. years). */
  binStep: {
    type: Number as PropType<number>,
    required: true,
  },
  // the top margin, in pixels
  marginTop: {
    type: Number as PropType<number>,
    default: 5,
  },
  // the right margin, in pixels
  marginRight: {
    type: Number as PropType<number>,
    default: 10,
  },
  // the bottom margin, in pixels
  marginBottom: {
    type: Number as PropType<number>,
    default: 20,
  },
  // the left margin, in pixels
  marginLeft: {
    type: Number as PropType<number>,
    default: 30,
  },
  // the outer width of the chart, in pixels
  width: {
    type: Number as PropType<number>,
    default: 640,
  },
  // the outer height of the chart, in pixels
  height: {
    type: Number as PropType<number>,
    default: 400,
  },
  // [xmin, xmax] — bins cover (edge_i, edge_{i+1}] over this domain
  xDomain: {
    type: Object as PropType<[number, number]>,
    required: true,
  },
  // [ymin, ymax]
  yDomain: {
    type: Object as PropType<[number, number]>,
    default: null,
  },
  // amount of x-range to reserve to separate bars
  xPadding: {
    type: Number as PropType<number>,
    default: 0.2,
  },
  // bar fill color
  color: {
    type: String as PropType<string>,
    default: 'currentColor',
  },
})
const emit = defineEmits(['clickBar'])

/**
 * Bin numeric values into fixed-width (x0, x1] intervals over [domainMin, domainMax].
 * The domain max lands in the last full-width bin — no thin overflow bar.
 */
const buildOpenClosedBins = (
  data: number[],
  domain: [number, number],
  step: number,
): OpenClosedBin[] => {
  if (step <= 0) return []
  const [domainMin, domainMax] = domain
  if (domainMax <= domainMin) return []

  const edges: number[] = []
  for (let x = domainMin; x < domainMax; x += step) {
    edges.push(x)
  }
  edges.push(domainMax)

  const bins: OpenClosedBin[] = []
  for (let i = 0; i < edges.length - 1; i += 1) {
    const x0 = edges[i]
    const x1 = edges[i + 1]
    const values = data.filter((d) => d > x0 && d <= x1)
    const bin = values as OpenClosedBin
    bin.x0 = x0
    bin.x1 = x1
    bins.push(bin)
  }
  return bins
}

const {
  data,
  binStep,
  width,
  height,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  xDomain,
  yDomain,
  xPadding,
  color,
} = toRefs(props)

const bins = computed(() => (
  buildOpenClosedBins(data.value, xDomain.value, binStep.value)
))

const nTicks = computed(() => Math.max(1, bins.value.length))

const _yDomain = computed(() => (
  yDomain.value ?? [0, Math.max(0, ...bins.value.map((d) => d.length))]
))

const xScale = computed(() => (
  scaleLinear(xDomain.value, [marginLeft.value, width.value - marginRight.value])
))
const yScale = computed(() => (
  scaleLinear(_yDomain.value, [height.value - marginBottom.value, marginTop.value])
))
const xAxis = computed(() => (
  axisBottom(xScale.value).ticks(Math.min(width.value / 20, nTicks.value), format('d'))
))
const yAxis = computed(() => (
  axisLeft(yScale.value).ticks(height.value / 40, format('d'))
))

// Add the x-axis and label.
const gX = ref<SVGGElement>()
watchEffect(() => {
  if (gX.value === undefined) return
  gX.value.innerHTML = ''
  select(gX.value).call(xAxis.value)
  selectAll('.tick')
    .call((g) => g.select('text').style('font-size', '0.5rem'))
})

// Add the y-axis and label, and remove the domain line.
const gY = ref<SVGGElement>()
watchEffect(() => {
  if (gY.value === undefined) return
  gY.value.innerHTML = ''
  select(gY.value)
    .call(yAxis.value)
    .call((g) => g.select('.domain').remove())
    .call((g) => g.selectAll('.tick line').clone().attr('x2', width.value - marginLeft.value - marginRight.value).attr('stroke-opacity', 0.1))
  selectAll('.tick')
    .call((g) => g.select('text').style('font-size', '0.5rem'))
})
</script>

<template>
  <svg
    :width="width"
    :height="height"
    :viewBox="`${[0, 0, width, height]}`"
    style="max-width: 100%; height: auto; height: intrinsic;"
  >
    <g ref="gY" :transform="`translate(${marginLeft},0)`" />
    <g :fill="color">
      <g
        v-for="(d, i) in bins"
        :key="i"
      >
        <rect
          :x="xScale(d.x0) + xPadding"
          :y="yScale(d.length)"
          :height="Math.max(0, yScale(0) - yScale(d.length))"
          :width="Math.max(0, xScale(d.x1) - xScale(d.x0) - xPadding)"
        />
        <rect
          hover:fill="opacity-50 teal-700"
          :x="xScale(d.x0) + xPadding"
          :y="yScale(_yDomain[1])"
          :height="Math.max(0, yScale(0) - yScale(_yDomain[1]))"
          :width="Math.max(0, xScale(d.x1) - xScale(d.x0) - xPadding)"
          fill="rgba(0, 0, 0, 0)"
          style="cursor: pointer;"
          @click="emit('clickBar', [d.x0, d.x1])"
        />
      </g>
    </g>
    <g ref="gX" :transform="`translate(0,${height - marginBottom})`" />
  </svg>
</template>
