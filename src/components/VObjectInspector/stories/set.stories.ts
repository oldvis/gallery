import type { Meta, StoryObj } from '@storybook/vue3'
import VObjectInspector from '../index.vue'

const meta = {
  title: 'Components/VObjectInspector/Set',
  component: VObjectInspector,
} satisfies Meta<typeof VObjectInspector>

export default meta

type Story = StoryObj<typeof meta>

export const EmptySet: Story = { args: { data: new Set() } }
export const SimpleSet: Story = { args: { data: new Set([1, 2, 3, 4]) } }
export const NestedSet: Story = { args: { data: new Set([1, 2, 3, new Set([1, 2])]), expandLevel: 2 } }
