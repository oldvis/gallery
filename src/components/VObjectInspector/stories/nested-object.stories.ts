import type { Meta, StoryObj } from '@storybook/vue3'
import VObjectInspector from '../index.vue'

const meta = {
  title: 'Components/VObjectInspector/NestedObject',
  component: VObjectInspector,
} satisfies Meta<typeof VObjectInspector>

export default meta

type Story = StoryObj<typeof meta>

export const IceSculpture: Story = {
  args: {
    data: {
      id: 2,
      name: 'An ice sculpture',
      tags: ['cold', 'ice'],
      dimensions: {
        length: 7.0,
        width: 12.0,
        height: 9.5,
      },
      warehouseLocation: {
        latitude: -78.75,
        longitude: 20.4,
      },
    },
    expandLevel: 2,
  },
}

export const Glossary: Story = {
  args: {
    data: {
      title: 'example glossary',
      GlossDiv: {
        title: 'S',
        GlossList: {
          GlossEntry: {
            ID: 'SGML',
            SortAs: 'SGML',
            GlossTerm: 'Standard Generalized Markup Language',
            Acronym: 'SGML',
            Abbrev: 'ISO 8879:1986',
            GlossDef: {
              para: 'A meta-markup language, used to create markup languages such as DocBook.',
              GlossSeeAlso: ['GML', 'XML'],
            },
            GlossSee: 'markup',
          },
        },
      },
    },
    expandLevel: 7,
  },
}

export const MixedTypes: Story = {
  args: {
    data: {
      a1: 1,
      a2: 'A2',
      a3: true,
      a4: undefined,
      a5: {
        'a5-1': null,
        'a5-2': ['a5-2-1', 'a5-2-2'],
        'a5-3': {},
      },
      a6() {
        // eslint-disable-next-line no-console
        console.log('hello world')
      },
      a7: new Date('2005-04-03'),
    },
    expandLevel: 3,
  },
}
