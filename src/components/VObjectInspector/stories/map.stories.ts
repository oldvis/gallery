import type { Meta, StoryObj } from '@storybook/vue3'
import VObjectInspector from '../index.vue'

const meta = {
  title: 'Components/VObjectInspector/Map',
  component: VObjectInspector,
  args: { expandLevel: 1 },
} satisfies Meta<typeof VObjectInspector>

export default meta

type Story = StoryObj<typeof meta>

export const EmptyMap: Story = { args: { data: new Map() } }
export const BooleanKeys: Story = {
  args: { data: new Map([[true, 'one'], [false, 'two']]) },
}
export const RegexKeys: Story = {
  args: { data: new Map([[/S/g, 'one'], [/D/g, 'two']]) },
}
export const StringKeys: Story = {
  args: { data: new Map([['one', 1], ['two', 2]]) },
}
export const ObjectKeys: Story = {
  args: { data: new Map([[{}, 1], [{ key: 2 }, 2]]) },
}
export const ArrayKeys: Story = {
  args: { data: new Map([[[1], 1], [[2], 2]]) },
}
export const MapKeys: Story = {
  args: { data: new Map([[new Map(), 1], [new Map([]), 2]]) },
}
