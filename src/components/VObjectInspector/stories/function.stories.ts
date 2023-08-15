import type { Meta, StoryObj } from '@storybook/vue3'
import VObjectInspector from '../index.vue'

const meta = {
  title: 'Components/VObjectInspector/Function',
  component: VObjectInspector,
} satisfies Meta<typeof VObjectInspector>

export default meta

type Story = StoryObj<typeof meta>

export const AnonymousFunction: Story = { args: { data() { } } }
export const AnonymousArrowFunction: Story = { args: { data: () => { } } }
export const NamedFunction: Story = {
  args: { data: function namedFunction() { } },
}
export const NamedFunctionShowNonEnumerable: Story = {
  args: {
    data: function namedFunction() { },
    showNonEnumerable: true,
    expandLevel: 1,
  },
}
