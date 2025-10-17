import type { PreTrainedModel, PreTrainedTokenizer, Tensor } from '@huggingface/transformers'
import { AutoTokenizer, CLIPTextModelWithProjection } from '@huggingface/transformers'
import withProgressBar from 'with-progress-bar'
import 'with-progress-bar/style.css'

interface ImageEmbedding {
  filename: string
  embedding: number[]
}

interface SearchResult {
  filename: string
  similarity: number
}

/** The name of the model used for image and text embedding. */
const MODEL_NAME = 'Xenova/clip-vit-base-patch16'

/** Load image embeddings from a JSON file. */
const loadImageEmbeddings = async (): Promise<ImageEmbedding[]> => {
  const embeddingsModule = await import('~/assets/embedding/output/embeddings_compressed.json')
  return embeddingsModule.default as ImageEmbedding[]
}

interface SVDTransformation {
  components: number[][]
}

/** Load SVD transformation parameters. */
const loadSVDTransformation = async (): Promise<SVDTransformation> => {
  const transformationModule = await import('~/assets/embedding/output/transformation.json')
  return transformationModule.default
}

/** Apply SVD transformation to an embedding. */
const applySVDTransformation = (embedding: number[], svdTransformation: SVDTransformation): number[] => {
  const { components } = svdTransformation
  const transformed = components.map((component) =>
    component.reduce((sum, val, i) => sum + val * embedding[i], 0),
  )
  return transformed
}

/** Calculate cosine similarity between two vectors. */
const cosineSimilarity = (a: number[], b: number[]): number => {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))

  if (magnitudeA === 0 || magnitudeB === 0) return 0
  return dotProduct / (magnitudeA * magnitudeB)
}

/** Calculate similarities and return top K results. */
const calculateSimilarities = (
  queryEmbedding: number[],
  embeddings: ImageEmbedding[],
  topK: number,
): SearchResult[] => {
  // Calculate similarities
  const similarities = embeddings.map((item) => ({
    filename: item.filename,
    similarity: cosineSimilarity(queryEmbedding, item.embedding),
  }))

  // Sort by similarity and return top K
  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK)
}

/** Utility to search by text */
export const useSearchByText = () => {
  let embeddings: ImageEmbedding[] = []
  let svdTransformation: SVDTransformation
  let tokenizer: PreTrainedTokenizer
  let textModel: PreTrainedModel
  let isInitialized = false

  const initialize = withProgressBar(async () => {
    if (isInitialized) return
    embeddings = await loadImageEmbeddings()
    svdTransformation = await loadSVDTransformation()
    // Reference: https://github.com/huggingface/transformers.js/pull/227
    tokenizer = await AutoTokenizer.from_pretrained(MODEL_NAME)
    // NOTE: q8 is faster, more memory efficient, but less accurate than fp32
    textModel = await CLIPTextModelWithProjection.from_pretrained(MODEL_NAME, { dtype: 'q8' })
    isInitialized = true
  })

  const searchByText = withProgressBar(async (textQuery: string, topK: number = 10): Promise<SearchResult[]> => {
    if (!isInitialized) {
      await initialize()
    }

    const textInputs = tokenizer(textQuery, { padding: true, truncation: true, return_tensors: 'pt' })
    const textFeatures = await textModel(textInputs)
    const textEmbeds: Tensor = textFeatures.text_embeds
    const queryEmbedding: number[] = textEmbeds.view(-1).normalize(2, -1).tolist()
    const queryEmbeddingTransformed: number[] = applySVDTransformation(queryEmbedding, svdTransformation)
    return calculateSimilarities(queryEmbeddingTransformed, embeddings, topK)
  })

  return {
    initialize,
    searchByText,
  }
}
