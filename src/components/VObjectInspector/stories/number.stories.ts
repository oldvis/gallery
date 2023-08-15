import type { Meta, StoryObj } from '@storybook/vue3'
import VObjectInspector from '../index.vue'

const meta = {
  title: 'Components/VObjectInspector/Number',
  component: VObjectInspector,
} satisfies Meta<typeof VObjectInspector>

export default meta

type Story = StoryObj<typeof meta>

export const Positive: Story = { args: { data: 42 } }
export const Zero: Story = { args: { data: 0 } }
export const Negative: Story = { args: { data: -1 } }
export const Float: Story = { args: { data: 1.5 } }
export const Exponential: Story = { args: { data: 1e100 } }
export const NotANumber: Story = { args: { data: Number.NaN } }
export const Infinity_: Story = { args: { data: Number.POSITIVE_INFINITY } }
