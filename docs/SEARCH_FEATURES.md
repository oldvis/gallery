# Gallery Search Features

This gallery supports search functionalities, including traditional metadata-based search and AI-powered image semantic search.

## Search Types

### 1. Freeform Search

Search across multiple metadata fields, including titles, abstracts, authors, descriptions, and tags.

**Usage:** use plain search terms
- [`Playfair`](https://oldvis.github.io/gallery/?search=Playfair) — finds visualizations by Playfair
- [`Neurath, Otto`](https://oldvis.github.io/gallery/?search=Neurath,+Otto) — finds visualizations by Otto Neurath

### 2. Field-Specific Search

Filter precisely by specific metadata fields using attribute-based queries.

**Usage:** `<field>:(<value>)` syntax
- [`authors:(Playfair, William)`](https://oldvis.github.io/gallery/?authors:(Playfair,+William)) — exact author match
- [`languages:(English)`](https://oldvis.github.io/gallery/?languages:(English)) — language-based filtering

**Supported Fields:**
- `uuid` — UUID of the visualization
- `authors` — Visualization authors
- `displayName` — Display name or title of the visualization
- `viewUrl` — URL to view the visualization
- `downloadUrl` — Downloadable resource URL
- `md5` — MD5 hash of the visualization image file
- `phash` — Perceptual hash of the visualization image
- `languages` — Language of the visualization
- `tags` — Classification tags
- `abstract` — Abstract or description of the visualization
- `rights` — Copyright or usage rights
- `source.name` — Name of the source or repository
- `source.url` — URL of the source
- `source.accessDate` — Date the source was accessed

### 3. Image Semantic Search

Find visualizations by describing their visual content in natural language, powered by the CLIP model.

**Usage:** `image:(<description>)` syntax
- [`image:(bar chart)`](https://oldvis.github.io/gallery/?image:(bar+chart)) — find bar charts
- [`image:(scatter plot)`](https://oldvis.github.io/gallery/?image:(scatter+plot)) — find scatter plots
- [`image:(heatmap)`](https://oldvis.github.io/gallery/?image:(heatmap)) — find heatmap visualizations
- [`image:(isotype)`](https://oldvis.github.io/gallery/?image:(isotype)) — find ISOTYPE visualizations
- [`image:(line chart)`](https://oldvis.github.io/gallery/?image:(line+chart)) — find line charts

**Advanced Usage:** Use `image:(<description>|topk:<N>)` to limit results to the top N most similar visualizations. If N is not specified, the default is 50.
- [`image:(line chart|topk:20)`](https://oldvis.github.io/gallery/?image:(line+chart|topk:20)) — returns the top 20 images that are semantically similar to "line chart"

## Combined Searches

You can combine multiple search types using `&` to create powerful, precise queries.

**Example:**
- [`authors:(Playfair, William)&source.name:(Internet Archive)`](https://oldvis.github.io/gallery/?authors:(Playfair,+William)&source.name:(Internet+Archive)) — William Playfair's visualizations stored in the Internet Archive
