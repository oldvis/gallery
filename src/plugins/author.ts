import rawAuthorsUrl from '~/assets/authors.json?url'

interface TimePoint {
  year: number
  month?: number
  day?: number
}

interface RawAuthor {
  name: string
  birth: TimePoint | [TimePoint, TimePoint] | null
  death: TimePoint | [TimePoint, TimePoint] | null
  occupations: string[]
  roles: string[]
  input: string
}

export interface Author {
  name: string
}

export const loadAuthors = async (): Promise<Author[]> => {
  const rawAuthors = await fetch(rawAuthorsUrl)
    .then((response) => response.json() as Promise<RawAuthor[]>)

  return rawAuthors.map((d) => ({
    name: d.name,
  }))
}
