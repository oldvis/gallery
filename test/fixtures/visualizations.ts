import type { Visualization } from '~/plugins/visualization'

export const makeVisualization = (
  overrides: Partial<Visualization> & Pick<Visualization, 'uuid'>,
): Visualization => ({
  authors: ['Author A'],
  displayName: `Entry ${overrides.uuid}`,
  publishDate: 1850,
  viewUrl: 'https://example.com/view',
  downloadUrl: 'https://example.com/img.png',
  languages: ['English'],
  tags: ['chart'],
  abstract: null,
  rights: 'public',
  source: {
    name: 'TestSource',
    url: 'https://example.com',
    accessDate: '2024-01-01',
  },
  ...overrides,
})
