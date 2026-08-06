/** Documented metadata fields for field:(value) queries and the Query builder. */
export const QUERY_FIELDS = [
  'uuid',
  'authors',
  'displayName',
  'viewUrl',
  'downloadUrl',
  'md5',
  'phash',
  'languages',
  'tags',
  'abstract',
  'rights',
  'source.name',
  'source.url',
  'source.accessDate',
] as const

export type QueryField = (typeof QUERY_FIELDS)[number]
