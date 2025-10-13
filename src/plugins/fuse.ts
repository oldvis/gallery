import type { IFuseOptions } from 'fuse.js'
import type { Visualization } from '~/plugins/visualization'

/**
 * Default Fuse.js options for search selectors
 */
export const DEFAULT_FUSE_OPTIONS: IFuseOptions<Visualization> = {
  threshold: 0,
  keys: ['uuid', 'authors', 'displayName', 'publishDate', 'tags'],
} as const
