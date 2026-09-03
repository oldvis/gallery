import { beforeEach, describe, expect, it, vi } from 'vitest'

const tokenizerFn = vi.fn(() => ({ input_ids: [1] }))
const fromTokenizer = vi.fn(async () => tokenizerFn)
const textModelFn = vi.fn(async () => ({
  text_embeds: {
    view: () => ({
      normalize: () => ({
        tolist: () => [1, 0],
      }),
    }),
  },
}))
const fromTextModel = vi.fn(async () => textModelFn)

vi.mock('@huggingface/transformers', () => ({
  AutoTokenizer: { from_pretrained: fromTokenizer },
  CLIPTextModelWithProjection: { from_pretrained: fromTextModel },
}))

vi.mock('~/assets/embedding/output/embeddings_compressed.json', () => ({
  default: [{ filename: 'abc.jpg', embedding: [1, 0] }],
}))

vi.mock('~/assets/embedding/output/transformation.json', () => ({
  default: { components: [[1, 0], [0, 1]] },
}))

vi.mock('with-progress-bar', () => ({
  default: <T extends (...args: never[]) => unknown>(fn: T) => fn,
}))

vi.mock('with-progress-bar/style.css', () => ({}))

describe('useSearchByText singleton', () => {
  beforeEach(() => {
    fromTokenizer.mockClear()
    fromTextModel.mockClear()
    tokenizerFn.mockClear()
    textModelFn.mockClear()
  })

  it('loads CLIP once across two factory calls', async () => {
    const { useSearchByText } = await import('~/composables/imageSearch')
    const first = useSearchByText()
    const firstHits = await first.searchByText('bar chart', 10)
    expect(firstHits).toHaveLength(1)
    expect(fromTokenizer).toHaveBeenCalledTimes(1)
    expect(fromTextModel).toHaveBeenCalledTimes(1)

    const second = useSearchByText()
    const secondHits = await second.searchByText('line chart', 10)
    expect(secondHits).toHaveLength(1)
    expect(fromTokenizer).toHaveBeenCalledTimes(1)
    expect(fromTextModel).toHaveBeenCalledTimes(1)
  })

  it('rethrows when CLIP fails to load', async () => {
    vi.resetModules()
    fromTokenizer.mockReset()
    fromTextModel.mockReset()
    fromTokenizer.mockImplementation(async () => tokenizerFn)
    fromTextModel.mockRejectedValueOnce(new Error('onnx missing'))
    const { useSearchByText } = await import('~/composables/imageSearch')
    const { searchByText } = useSearchByText()
    await expect(searchByText('fail query', 10)).rejects.toThrow('onnx missing')
  })
})
