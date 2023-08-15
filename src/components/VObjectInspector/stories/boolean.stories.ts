import type { Meta, StoryObj } from '@storybook/vue3'
import VObjectInspector from '../index.vue'

const meta = {
  title: 'Components/VObjectInspector/Boolean',
  component: VObjectInspector,
} satisfies Meta<typeof VObjectInspector>

export default meta

type Story = StoryObj<typeof meta>

export const True: Story = { args: { data: true } }
export const False: Story = { args: { data: false } }
