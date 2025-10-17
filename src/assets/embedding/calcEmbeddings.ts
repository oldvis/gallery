import type { ImageFeatureExtractionPipeline } from 'npm:@huggingface/transformers'
import ProgressBar from 'jsr:@deno-library/progress'
import { pipeline } from 'npm:@huggingface/transformers'
import { Decomposition } from 'npm:@kanaries/ml'

// Global model and processor
const MODEL_NAME = 'Xenova/clip-vit-base-patch16'
let PIPELINE: ImageFeatureExtractionPipeline

interface EmbeddingObject {
  filename: string
  embedding: number[] | null
}

/**
 * Load embeddings from a JSONL file.
 */
const loadJL = (filePath: string): EmbeddingObject[] => {
  try {
    const content = Deno.readTextFileSync(filePath)
    return content
      .trim()
      .split('\n')
      .filter((line: string) => line.trim())
      .map((line: string) => JSON.parse(line))
  }
  catch {
    return []
  }
}

/**
 * Load the image feature extraction model.
 */
const loadModel = async (): Promise<void> => {
  PIPELINE = await pipeline('image-feature-extraction', MODEL_NAME, { dtype: 'fp32' })
}

/**
 * Compute the embedding for a single image.
 */
const computeImageEmbedding = async (imageFile: File): Promise<number[]> => {
  const features = await PIPELINE(imageFile)
  return features.view(-1).normalize(2, -1).tolist()
}

/**
 * Filter filenames to exclude those already processed.
 */
const filterFilenames = (filenames: string[], embeddingPath: string): string[] => {
  const stored = loadJL(embeddingPath)
  const storedFilenames = new Set(stored.map((d) => d.filename))
  return filenames.filter((filename) => !storedFilenames.has(filename))
}

/**
 * Save embeddings for images in a directory.
 */
const saveEmbeddings = async (imgDir: string, saveTo: string): Promise<void> => {
  // Extract output directory from path and create it if it doesn't exist
  const outputDir = saveTo.split('/').slice(0, -1).join('/')
  await Deno.mkdir(outputDir, { recursive: true })

  // Get sorted filenames from directory
  let filenames: string[] = []
  for await (const dirEntry of Deno.readDir(imgDir)) {
    if (dirEntry.isFile) {
      filenames.push(dirEntry.name)
    }
  }
  filenames.sort()
  filenames = filterFilenames(filenames, saveTo)

  const progress = new ProgressBar({
    title: 'Saving embeddings',
    total: filenames.length,
  })

  for (const [i, filename] of filenames.entries()) {
    const imagePath = `${imgDir}/${filename}`
    const imageData = await Deno.readFile(imagePath)
    const imageFile = new File([imageData], filename, { type: 'image/jpeg' })
    const embedding = await computeImageEmbedding(imageFile)
    const entry: EmbeddingObject = {
      filename,
      embedding,
    }

    const line = `${JSON.stringify(entry)}\n`
    await Deno.writeFile(saveTo, new TextEncoder().encode(line), { append: true, create: true })
    progress.render(i + 1)
  }
}

interface SVDTransformation {
  components: number[][]
}

/**
 * Compress embeddings from file.
 */
const compressEmbeddingsFromFile = (
  embeddingsFilePath: string,
  nDims: number = 16,
): { embeddings: EmbeddingObject[], transformation: SVDTransformation } => {
  const entriesAll: EmbeddingObject[] = loadJL(embeddingsFilePath)
  const entries = entriesAll.filter((entry) => entry.embedding !== null)

  if (entries.length === 0) {
    throw new Error('No embeddings found')
  }

  const embeddings = entries.map((entry) => entry.embedding as number[])

  const pca = new Decomposition.TruncatedSVD(nDims)
  const embeddingsReduced = pca.fitTransform(embeddings)
  const components = pca.getComponents()

  return {
    embeddings: entries.map((entry, i) => ({
      filename: entry.filename,
      embedding: embeddingsReduced[i],
    })),
    transformation: { components },
  }
}

/**
 * Main function.
 * Compute image embeddings using CLIP and apply SVD compression.
 */
const main = async (): Promise<void> => {
  await loadModel()

  // Step 1: Compute and save raw embeddings
  const imgDir = './images'
  const embeddingsRawPath = './output/embeddings_raw.jsonl'
  await saveEmbeddings(imgDir, embeddingsRawPath)

  // Step 2: Compress embeddings with SVD
  const embeddingsCompressedPath = './output/embeddings_compressed.jsonl'
  const transformationPath = './output/transformation.json'
  const { embeddings: embeddingsCompressed, transformation } = compressEmbeddingsFromFile(embeddingsRawPath, 16)
  Deno.writeTextFileSync(embeddingsCompressedPath, JSON.stringify(embeddingsCompressed, null, 0))
  Deno.writeTextFileSync(transformationPath, JSON.stringify(transformation, null, 0))
}

if (import.meta.main) {
  main()

  // NOTE: The terminal will show "libc++abi: terminating due to uncaught exception of type std::__1::system_error: mutex lock failed: Invalid argument",
  // due to an issue with transformers.js.
  // Reference: https://github.com/huggingface/transformers.js/issues/1403
}
