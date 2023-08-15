import Ajv from 'ajv'
import type { JSONSchemaType } from 'ajv'
import type { Visualization } from '~/plugins/visualization'

/** Schema of a partial visualization entry. */
const schema: JSONSchemaType<Partial<Visualization>> = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    uuid: {
      type: 'string',
      nullable: true,
    },
    authors: {
      items: { type: 'string' },
      type: 'array',
      nullable: true,
    },
    displayName: {
      type: 'string',
      nullable: true,
    },
    publishDate: {
      type: 'number',
      nullable: true,
    },
    viewUrl: {
      type: 'string',
      nullable: true,
    },
    downloadUrl: {
      type: 'string',
      nullable: true,
    },
    md5: {
      type: 'string',
      nullable: true,
    },
    phash: {
      type: 'string',
      nullable: true,
    },
    resolution: {
      items: [{ type: 'number' }, { type: 'number' }],
      minItems: 2,
      maxItems: 2,
      type: 'array',
      nullable: true,
    },
    fileSize: {
      type: 'number',
      nullable: true,
    },
    languages: {
      items: { type: 'string' },
      type: 'array',
      nullable: true,
    },
    tags: {
      items: { type: 'string' },
      type: 'array',
      nullable: true,
    },
    abstract: {
      type: 'string',
      nullable: true,
    },
    rights: {
      type: 'string',
      nullable: true,
    },
    source: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        url: { type: 'string' },
        accessDate: { type: 'string' },
      },
      required: ['name', 'url', 'accessDate'],
      additionalProperties: false,
      nullable: true,
    },
  },
  additionalProperties: true,
}

const ajv = new Ajv({ allowUnionTypes: true })

/** Validate the schema of the object storing the new entry. */
const validate = ajv.compile(schema)

export const validateInput = (input: string) => {
  let parsed: object | null = null
  let validJson = false
  let validVisualization = false
  try {
    parsed = JSON.parse(input)
    validJson = true
    validVisualization = validate(parsed)
  }
  catch {}
  return {
    parsed,
    validJson,
    validVisualization,
  }
}
