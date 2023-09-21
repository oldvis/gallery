<script setup lang="ts">
import {
  axisBottom,
  axisLeft,
  bin,
  format,
  scaleLinear,
  select,
  selectAll,
} from 'd3'

const {
  data,
  nThresholds,
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
} = defineProps({
  data: {
    type: Array as PropType<number[]>,
    required: true,
  },
  // the number of thresholds for binning
  nThresholds: {
    type: Number as PropType<number>,
    default: 20,
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
  // an array of (ordinal) x-values
  xDomain: {
    type: Object as PropType<[number, number]>,
    default: null,
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

// Bin the data.
const bins = computed(() => (
  bin().thresholds(nThresholds).value((d) => d)(data)
))

// Compute default domains, and unique the x-domain.
const _xDomain = computed(() => (
  xDomain ?? [bins.value[0].x0, bins.value[bins.value.length - 1].x1]
))
const _yDomain = computed(() => (
  yDomain ?? [0, Math.max(...bins.value.map((d) => d.length))]
))

const xScale = computed(() => (
  scaleLinear(_xDomain.value, [marginLeft, width - marginRight])
))
const yScale = computed(() => (
  scaleLinear(_yDomain.value, [height - marginBottom, marginTop])
))
const xAxis = computed(() => (
  axisBottom(xScale.value).ticks(Math.min(width / 20, nThresholds), format('d'))
))
const yAxis = computed(() => (
  axisLeft(yScale.value).ticks(height / 40, format('d'))
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
    .call((g) => g.selectAll('.tick line').clone()
      .attr('x2', width - marginLeft - marginRight)
      .attr('stroke-opacity', 0.1))
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
          :x="xScale(d.x0 as number) + xPadding"
          :y="yScale(d.length)"
          :height="Math.max(0, yScale(0) - yScale(d.length))"
          :width="Math.max(0, xScale(d.x1 as number) - xScale(d.x0 as number) - xPadding)"
        />
        <rect
          hover:fill="opacity-50 teal-700"
          :x="xScale(d.x0 as number) + xPadding"
          :y="yScale(_yDomain[1])"
          :height="Math.max(0, yScale(0) - yScale(_yDomain[1]))"
          :width="Math.max(0, xScale(d.x1 as number) - xScale(d.x0 as number) - xPadding)"
          fill="rgba(0, 0, 0, 0)"
          style="cursor: pointer;"
          @click="emit('clickBar', [d.x0, d.x1])"
        />
      </g>
    </g>
    <g ref="gX" :transform="`translate(0,${height - marginBottom})`" />
  </svg>
</template>
