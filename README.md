<a href="http://commitizen.github.io/cz-cli/">
    <img alt="Commitizen friendly" src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg">
</a>

# OldVis Gallery

![](./public/screenshot.png)

A web-based gallery of historical visualizations ([live demo](https://oldvis.github.io/gallery/)).

The gallery uses the dataset from [oldvis_dataset](https://github.com/oldvis/oldvis_dataset).

## Search Features

- Freeform search across multiple metadata fields (e.g., [`Playfair`](https://oldvis.github.io/gallery/?search=Playfair))
- Field-specific exact search using the `<field>:(<value>)` syntax (e.g., [`authors:(Playfair, William)`](https://oldvis.github.io/gallery/?authors:(Playfair,+William)))
- AI-powered image semantic search using the `image:(<description>)` syntax (e.g., [`image:(bar chart)`](https://oldvis.github.io/gallery/?image:(bar+chart)))
- Multi-criteria queries combining search types with the `&` operator
- Embed query parameters in URLs for sharing (e.g., [`https://oldvis.github.io/gallery/?authors:(Neurath,+Otto)`](https://oldvis.github.io/gallery/?authors:(Neurath,+Otto)))

See [./docs/SEARCH_FEATURES.md](./docs/SEARCH_FEATURES.md) for more details.

## Development Instructions

1. Run `pnpm install` to install dependencies (make sure you have [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/) installed beforehand).
2. Run `pnpm run dev` to launch the development server.

This repository is initialized with the [vitesse-lite template](https://github.com/antfu/vitesse-lite).

## Reference

If you use this gallery in a scientific publication, we would appreciate it if you cite the following paper:

```
@Article{Zhang2023OldVisOnline,
  author    = {Zhang, Yu and Jiang, Ruike and Xie, Liwenhan and Zhao, Yuheng and Liu, Can and Ding, Tianhong and Chen, Siming and Yuan, Xiaoru},
  title     = {{OldVisOnline}: Curating a Dataset of Historical Visualizations},
  doi       = {10.1109/TVCG.2023.3326908},
  volume    = {30},
  number    = {1},
  pages     = {551--561},
  journal   = {IEEE Transactions on Visualization and Computer Graphics},
  publisher = {IEEE},
  year      = {2023},
}
```
