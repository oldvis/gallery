import type { Meta, StoryObj } from '@storybook/vue3'
import VObjectInspector from '../index.vue'

const meta = {
  title: 'Components/VObjectInspector/BigInt',
  component: VObjectInspector,
} satisfies Meta<typeof VObjectInspector>

export default meta

type Story = StoryObj<typeof meta>

/** Reference: https://github.com/storybookjs/storybook/issues/22452 */
// eslint-disable-next-line no-extend-native
BigInt.prototype.toString = function () {
  return this.toString()
}

export const Positive: Story = { args: { data: 42n } }
export const Zero: Story = { args: { data: 0n } }
export const Negative: Story = { args: { data: -1n } }
