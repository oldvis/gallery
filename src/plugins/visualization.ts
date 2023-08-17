import { iso6393 } from 'iso-639-3'
import { groupBy } from 'lodash'
import rawVisualizations from '~/assets/visualizations.json'

// Sort the visualizations by number of entries in the data source.
const rawVisualizationsSorted = Object
  .entries(groupBy(rawVisualizations as RawVisualization[], 'source.name'))
  .sort((a, b) => (b[1].length - a[1].length))
  .map((d) => d[1])
  .flat()

interface TimePoint {
  year: number
  month?: number
  day?: number
}

interface RawVisualization {
  uuid: string
  authors: string[] | null
  displayName: string
  publishDate: TimePoint | [TimePoint, TimePoint] | null
  viewUrl: string
  downloadUrl: string
  md5?: string
  phash?: string
  resolution?: [number, number]
  fileSize?: number
  languages: string[]
  tags: string[]
  abstract: string | null
  rights: string
  source: {
    name: string
    url: string
    /** In ISO format */
    accessDate: string
  }
}

export interface Visualization extends Omit<RawVisualization, 'publishDate' | 'languages'> {
  /** Originally stored as { year: number }. Converted to integer. */
  publishDate: number | null
  /** Originally stored in ISO format. Converted to full name. */
  languages: string[]
}

const iso6393ToName: Record<string, string> = {
  ...Object.fromEntries(iso6393.map((d) => [d.iso6393, d.name])),
  sla: 'Slavic',
  pra: 'Prakrit',
  ota: 'Ottoman Turkish',
  ang: 'Old English',
  swa: 'Swahili',
  ell: 'Modern Greek',
}

const getPublishYear = (
  publishDate: TimePoint | [TimePoint, TimePoint] | null,
): number | null => {
  if (publishDate === null) return null
  if (Array.isArray(publishDate)) return publishDate[0].year
  return publishDate.year
}

const getLanguageFullNames = (languages: string[]): string[] => (
  languages?.map((lang: string) => {
    if (lang in iso6393ToName) {
      return iso6393ToName[lang]
    }
    return (new Intl.DisplayNames(['en'], { type: 'language' })).of(lang)
  }).filter((d) => d !== undefined) as string[] ?? []
)

export const visualizations: Visualization[] = rawVisualizationsSorted.map((d) => ({
  ...d,
  publishDate: getPublishYear(d.publishDate),
  languages: getLanguageFullNames(d.languages),
}))
