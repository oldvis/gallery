import type { Meta, StoryObj } from '@storybook/vue3'
import VObjectInspector from '../index.vue'

const meta = {
  title: 'Components/VObjectInspector/Theme',
  component: VObjectInspector,
} satisfies Meta<typeof VObjectInspector>

export default meta

type Story = StoryObj<typeof meta>

const data = { a: 1, b: 'abc', c: [1, 2, 3] }

export const ChromeLight: Story = { args: { data } }
export const ChromeDark: Story = { args: { data, darkTheme: true } }
