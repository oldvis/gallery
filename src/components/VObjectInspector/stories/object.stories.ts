import type { Meta, StoryObj } from '@storybook/vue3'
import VObjectInspector from '../index.vue'

const meta = {
  title: 'Components/VObjectInspector/Object',
  component: VObjectInspector,
} satisfies Meta<typeof VObjectInspector>

export default meta

type Story = StoryObj<typeof meta>

export const Date_: Story = { args: { data: new Date('2005-04-03') } }
export const RegularExpression: Story = { args: { data: /^.*$/ } }
export const EmptyObject: Story = {
  args: { data: {}, showNonEnumerable: true, expandLevel: 1 },
}
export const EmptyStringKey: Story = { args: { data: { '': 'hi' } } }
export const ObjectWithGetter: Story = {
  args: { data: { get prop() { return 'v' } }, expandLevel: 2 },
}
// TODO: this example does not work at the moment
export const ObjectWithGetterThatThrows: Story = {
  args: {
    data: { get prop() { throw new Error('error') } },
    expandLevel: 2,
  },
}
export const SimpleObject: Story = {
  args: {
    data: { k: 'v' },
    showNonEnumerable: true,
    expandLevel: 2,
  },
}
export const InheritedObject: Story = {
  args: {
    data: Object.create({ k: 'v' }),
    showNonEnumerable: true,
    expandLevel: 2,
  },
}
export const Object_: Story = {
  args: {
    data: Object,
    showNonEnumerable: true,
    expandLevel: 1,
  },
}
export const ObjectPrototype: Story = {
  args: {
    data: Object.prototype,
    showNonEnumerable: true,
    expandLevel: 1,
  },
  name: 'Object.prototype',
}
export const SimpleObjectWithName: Story = {
  args: {
    data: { k: 'v' },
    name: 'test',
    showNonEnumerable: true,
    expandLevel: 2,
  },
}
export const EmptyObjectWithNullPrototype: Story = {
  args: {
    data: Object.create(null),
    showNonEnumerable: true,
    expandLevel: 1,
  },
}
export const ObjectWithNullPrototype: Story = {
  args: {
    data: Object.assign(Object.create(null), { key: 'value' }),
    showNonEnumerable: true,
    expandLevel: 1,
  },
}
