# Image Embedding Pipeline

This directory contains utilities for computing and compressing image embeddings using CLIP for similarity search.

## Installation

This project requires the [Deno](https://deno.land/) runtime.

To install dependencies, run:

```bash
deno install
```

## Usage

Run the script to process images in the `./images` directory:

```bash
deno run -A calcEmbeddings.ts
```

This will:
1. Download and load the CLIP ViT-Base-Patch32 model and processor (only on the first run).
2. **Compute embeddings:** Process all images in the `./images` directory, compute 512-dimensional embeddings for each image, and save them to `./output/embeddings_raw.jsonl`.
3. **Compress embeddings:** Compute 16-dimensional compressed embeddings using SVD. Save the compressed embeddings to `./output/embeddings_compressed.jsonl` and the SVD transformation parameters (components) to `./output/transformation.json`.

## Files

- **`./images/`** – Directory containing source visualization images. (Git-ignored as this directory is large.)
- **`./calcEmbeddings.ts`** – Main TypeScript script for computing and compressing embeddings using Deno.
- **`./deno.json`** – Deno configuration file with dependencies and task definitions.
- **`./deno.lock`** – Deno lock file for dependency version management.
- **`./output/embeddings_raw.jsonl`** – Raw 512-dimensional CLIP embeddings, one JSON object per line (JSONL format). (Git-ignored as this file is large.)
- **`./output/embeddings_compressed.jsonl`** – Compressed 16-dimensional SVD embeddings, one JSON object per line (JSONL format).
- **`./output/transformation.json`** – SVD transformation parameters (components) as a single JSON object.

### Data Structure

#### `output/embeddings_raw.jsonl`

Each line is a JSON object with the following structure:
```typescript
interface RawEmbeddingEntry {
  filename: string // Image filename in the format {uuid}.{ext}
  embedding: number[] // 512-dimensional embedding vector (length = 512)
}
```

#### `output/embeddings_compressed.jsonl`

Each line is a JSON object with the following structure:
```typescript
interface CompressedEmbeddingEntry {
  filename: string // Image filename in the format {uuid}.{ext}
  embedding: number[] // 16-dimensional embedding vector (length = 16)
}
```

#### `output/transformation.json`

The JSON object contains SVD transformation data:
```typescript
interface SVDTransformation {
  components: number[][] // 16 SVD components, each a 512-dimensional vector (16 x 512)
}
```
