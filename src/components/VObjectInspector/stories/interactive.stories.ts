import type { Meta, StoryObj } from '@storybook/vue3'
import VInteractive from './VInteractive.vue'

const meta = {
  title: 'Components/VObjectInspector',
  component: VInteractive,
} satisfies Meta<typeof VInteractive>

export default meta

type Story = StoryObj<typeof meta>
export const Interactive: Story = {}
