import type { Meta, StoryObj } from '@storybook/vue3'
import VObjectInspector from '../index.vue'

const meta = {
  title: 'Components/VObjectInspector/Array',
  component: VObjectInspector,
} satisfies Meta<typeof VObjectInspector>

export default meta

type Story = StoryObj<typeof meta>

export const EmptyArray: Story = { args: { data: [] } }
export const EmptyArrayShowNonEnumerable: Story = {
  args: { data: [], expandLevel: 1, showNonEnumerable: true },
}
export const BasicArray: Story = {
  args: { data: ['cold', 'ice'], expandLevel: 1 },
}
export const ArrayWithDifferentTypesOfElements: Story = {
  args: { data: ['a', 1, {}], expandLevel: 1 },
}
export const LongArray: Story = {
  args: { data: Array.from({ length: 1000 }).fill(0).map((x, i) => `${i}`) },
}
export const ArrayWithBigObjects: Story = {
  args: {
    data: Array.from({ length: 100 }).fill(0).map((x, i) => ({
      key: i,
      name: `John #${i}`,
      dateOfBirth: new Date(i * 10e8),
      address: `${i} Main Street`,
      zip: 90210 + i,
    })),
  },
}
export const Uint32Array_: Story = { args: { data: new Uint32Array(1000) } }
