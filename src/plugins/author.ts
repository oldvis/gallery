import rawAuthors from '~/assets/authors.json'

interface TimePoint {
  year: number
  month?: number
  day?: number
}

interface RawAuthor {
  name: string
  birth: TimePoint | [TimePoint, TimePoint] | null
  death: TimePoint | [TimePoint, TimePoint] | null
  occupation: string | null
  input: string
}

export interface Author {
  name: string
}

export const authors: Author[] = (rawAuthors as RawAuthor[]).map((d) => ({
  name: d.name,
}))
