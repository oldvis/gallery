---
version: alpha
name: OldVis
description: Shared visual language for OldVis productivity labeling and gallery apps. Family resemblance across repos; task layouts may differ.
colors:
  primary: "#0d9488"
  primary-hover: "#0f766e"
  danger: "#dc2626"
  danger-hover: "#b91c1c"
  neutral-action: "#525252"
  surface: "#ffffff"
  surface-dark: "#121212"
  surface-elevated-dark: "#1a1a1a"
  border: "#e5e7eb"
  border-dark: "#374151"
  text: "#111827"
  text-muted: "#6b7280"
  text-on-primary: "#ffffff"
typography:
  chrome:
    fontFamily: system-ui, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.2
  chrome-emphasis:
    fontFamily: system-ui, sans-serif
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.2
  label-button:
    fontFamily: system-ui, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.2
rounded:
  sm: 4px
  md: 6px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  strip: 12px
  strip-control: 24px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-on-primary}"
    rounded: "{rounded.md}"
    padding: 2px 8px
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: 2px 8px
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.text-on-primary}"
    rounded: "{rounded.md}"
    padding: 2px 8px
  button-neutral:
    backgroundColor: "{colors.neutral-action}"
    textColor: "{colors.text-on-primary}"
    rounded: "{rounded.md}"
    padding: 2px 8px
---

# OldVis Design System

## Overview

OldVis apps are **productivity tools** for labeling and browsing historical visualizations. The UI should feel calm, dense, and fast — not marketing-polished. Annotators spend hours here; chrome must stay out of the way of the image and the next action.

Shared identity is **family resemblance**, not pixel-lockstep across repos. All apps share naming, type, color ladder, and shell grammar. Task-specific surfaces (classification buttons, Konva tools, gallery facets, taxonomy trees) stay in each app.

Brand format in the nav: **`OldVis · {Task}`** where Task is one of: Classify, Segment, Gallery, Taxonomy Label, Taxonomy Compare.

## Colors

- **Primary (Teal `#0d9488`):** Affirmative chrome commits — dialog **Save**, active filter state (`pill-on`). Classification yes-tones use the same hue as a soft tint (`btn-label`), not a solid fill. Segment Vis tag swatches use the solid hue.
- **Danger (Red `#dc2626`):** Destructive chrome emphasis. Classification “Not X” uses a soft red tint (`btn-label-warn`). Segment **Not Vis** swatches use the solid hue.
- **Neutral / Confident:** Unsure = soft gray (`btn-label-neutral` / solid `#6b7280` swatch). Confident = soft sky (`btn-label-confident` / solid `#0284c7` swatch). Meta tags, not a third solid primary.
- **Mark categories (Segment):** Other Draw classes (Line, Arc, …) keep a categorical palette (`schemeCategory10`); do not reuse polarity hues for those.
- **Secondary (outline white):** Chrome strip actions (Previous/Next, Download/Upload, Set annotator name, dialog Cancel) and filter toggles off-state.
- **Ghost:** Low-emphasis text actions (Copy, metadata links, Clear, Details).
- **Surfaces:** White / `#121212` dark page; strip bands gray-50 / gray-900; borders gray-200 / gray-700. Hierarchy via borders and density, not button shadows.

Do not introduce purple accents, glow, or decorative hero treatments.

## Typography

Keep the type ladder short — prefer weight over size/family switches:

| Role          | Size               | Weight             | Use                                                 |
| ------------- | ------------------ | ------------------ | --------------------------------------------------- |
| Chrome        | 14px (`text-sm`)   | regular / semibold | All strips, buttons, pills, chips, counts, metadata |
| Label buttons | 16px (`text-base`) | regular            | Classification pairs only                           |

- **System UI stack** only — no webfont, no mono in chrome (counts use `font-semibold`).
- Chrome copy uses **sentence case** (capitalize the first word and proper nouns only) — e.g. Go to first unlabeled, Hide details, View metadata. This matches major design systems (Material, Fluent, Carbon, Polaris) and keeps dense productivity chrome quieter than Title Case.
- **Section / strip titles** stay short UI names (`Entries`, `Selectors`, `Tags`, `Temporal`).
- **Muted stats / units** stay lowercase (`101 matched · 13511 entries`, `years`; Progress metric words below).
- **Sentinels** use lowercase values (`unknown`); short sentinel phrases use sentence case (`Unknown year`).
- **Acronyms / products** keep conventional form (`URL`, `Google`, `CLIP`, `Top-K`, `OldVis`).
- **Catalog / data values** are never re-cased (titles, authors, tags, abstracts as stored).
- Nav brand: semibold family name + muted middle-dot task (`OldVis · Classify`).

## Layout

Shell grammar for labeling apps:

1. **Nav** — favicon, `OldVis · {Task}`, identity control, theme, GitHub (plus app-specific nav widgets).
2. **Top strip** — Selectors (Classify) or Draw | Tags (Segment) only (dense; not a second dumping ground for Progress).
3. **Workbench** — task surface (image + labels, canvas + objects, facets + entries, tree + entries).
4. **Bottom strip** — Progress counts, Details (where applicable), Download / Upload.

Classify entry layout: **image left (~3/5), metadata + label controls right (~2/5)** inside one **Entries** workbench. Segment: **Entries** (~7/10 canvas) | **Objects** (~3/10 instance list). Do not move classification buttons under the image. Chrome label for the item queue is always **Entries** (not Subject / data object). **Entries** headers use the same images icon in every app.

**Objects cards (Segment):** Inspector hierarchy — **mark class**(es) as `■ Class · ■ Class` (Draw palette; `+N` only after 3 unique types) when marks exist; muted `Shape {geometry}` line for the region shape (Rect/Point/Polygon); `Last modified by {name}`; Details / Repeat / Marks on the full card with compact `h-6` section headers (small chevrons / +); mark editors as flat field rows. Do not collapse unselected objects to a single row.

**Progress stats:** Coverage group first (`labeled n / total · unlabeled n` plus `skipped` when the app has it), then `|`, then confidence tags (`unsure · confident`). Middots stay inside a group; `|` separates axes. Example (with Skipped): `labeled 13 / 485 · unlabeled 472 · skipped 0 | unsure 2 · confident 5`. Details (Classify) sits after the tag group without a middot. In Segment, Unsure/Confident **buttons** stay single-word sentence-case labels; the Progress strip uses the lowercase forms. Unsure/Confident counts multilabel image tags that include those values (not a partition of total).

Spacing is tight (`xs`/`sm`); prefer one workbench plane over nested heavy cards. Panels may use a light border + small radius; avoid multi-layer shadows.

**Command bars:** Nav, Selectors, Entries header, image footer, and Progress share one geometry (`min-h-10`, `py-1.5`). Chrome controls inside them share `h-6` so vertical padding matches (never flush). Do not mix strip paddings. **Adjacent chrome controls in a cluster** (pills, Previous/Next, Download/Upload) use `gap-1`; reserve strip `gap-x-2` for spacing between strip regions (label · stats · actions), not between sibling buttons.

**Information rule:** Reorganization is allowed. Removing filters, counts, actions, or metadata affordances is not. If something existed in the previous UI, it must remain reachable (possibly denser or collapsed behind Details).

## Elevation & Depth

Flat chrome controls (buttons/pills/chips: border only, no drop shadow). Separation via **one** 1px border and background contrast (status strips on gray-50 / gray-900). Do not stack borders from adjacent regions. Dialogs are the exception: panel may use a single `shadow-md` plus a dimmed backdrop (`dialog-backdrop`) so modality reads clearly.

## Shapes

Small radii (`~6px`) on buttons, inputs, and panels. Filter toggles (`pill` / `pill-on`) always show a border so they read as clickable; active state uses teal border + tint **without** changing font weight (bold shifts button width). Active filter chips use `chip`. Classification uses soft polarity fills (`btn-label*`: tinted surface + colored text/border, `text-base`, `min-h-9`) so the dense label grid stays calm next to images. Selected state is a ring, not a heavier fill. Chrome controls share one geometry (`h-6`, border, no shadow).

## Components

### Buttons (Uno shortcuts in each app)

| Shortcut                                                            | Use                                                                     |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `btn-secondary`                                                     | Chrome / Cancel — outline white, `h-6`                                  |
| `btn`                                                               | Dialog Save / Retry — filled teal, same `h-6`                           |
| `btn-ghost`                                                         | Low-emphasis utilities (same `h-6`)                                     |
| `btn-label*`                                                        | Classification labels only — soft tints (`text-base`)                   |
| `pill` / `pill-on` / `chip`                                         | Filter toggles and active filter chips (`h-6`)                          |
| `strip-label` / `strip-meta` / `strip-meta-em` / `strip-sep`        | Strip titles, muted copy, emphasized counts, middot (`·`) between stats |
| `input-area`                                                        | Compact strip search input (`h-6`)                                      |
| `dialog-panel` / `dialog-body` / `dialog-field` / `dialog-backdrop` | Modal chrome (see Dialogs)                                              |
| `icon-btn`                                                          | Theme, GitHub, close                                                    |
| `kbd`                                                               | Subtle key hint on hot-path buttons (inherits text color, low opacity)  |
| `tool-btn` / `tool-btn-active`                                      | Segment draw tools — same `h-6` as pills (Segment `uno.config.ts` only) |
| `menu-trigger` / `menu-panel` / `menu-item` / `menu-item-on`        | Segment compact selects (Segment only)                                  |

Focus-visible: teal ring. Disabled: reduced opacity, no pointer events.

### Keyboard (Classify)

| Keys      | Action                                                           |
| --------- | ---------------------------------------------------------------- |
| `1`–`8`   | Vis/NotVis … Table/NotTable (odd = yes column, even = no column) |
| `9` / `0` | Unsure / Confident                                               |
| `A` / `D` | Previous / Next entry                                            |

Hints use the `kbd` badge on those buttons. Ignore shortcuts when focus is in an editable field or a modifier (Ctrl/Meta/Alt) is held.

### Status strips

Dense horizontal rows (`status-strip` / `view-header`). Top = Selectors/Tools. Bottom = Progress + I/O. Image-footer nav stays under the image only; side-pane utilities (View metadata, Copy, URL) stay in-pane without forming a half-width bar across the workbench. Inline strip **stats** use middot separators within a group (`strip-sep`: `1/1 labeled on page · 89 matched · 13511 entries`). Progress uses `|` between coverage and confidence-tag groups. Do not put middots around action controls (e.g. Details) — those sit after the stats with normal spacing.

### Dialogs

Compact panel, not a spacious card. Structure:

1. **Backdrop** — `dialog-backdrop` (centered, dimmed).
2. **Panel** — `dialog-panel` (narrow, bordered, single soft shadow).
3. **Header / footer** — reuse `status-strip` with border-b / border-t (same density as app chrome).
4. **Body** — `dialog-body`; fields use `dialog-field` (`h-8`, not strip `h-6`).
5. **Actions** — Cancel = `btn-secondary`, Save = `btn` (teal). Do not make both outline.

Keep Name + Save + Clear (or equivalent) capabilities. Nav Clear stays outside the dialog as `btn-ghost`.

### Domain widgets

Stay app-local: classification pairs, segmentation tool buttons, gallery facets, Element Plus trees. They must **consume** the shared color/type rules, not redefine a second palette.

## Do's and Don'ts

- Do keep Progress + Download/Upload at the **bottom**.
- Do keep Selectors/Tools at the **top**, without stuffing Progress into that row.
- Do preserve every existing control and count; densify instead of deleting.
- Do put entry position in the image footer (`n / matched`), not as `#index` under the title.
- Do use `OldVis · {Task}` in the nav; align document titles (e.g. `Classify · OldVis`).
- Don't build a shared Vue button/card library until multiple apps truly duplicate chrome markup.
- Don't add decorative gradients, hero imagery, or marketing card grids to labeling surfaces.
- Don't block labeling behind identity; keep Set Name in the nav. Use a one-shot info snackbar for the unsigned nudge — not a permanent layout bar. The nudge stays until the user closes it or sets a name (same copy and chrome in every app: “Set a name in the header…”).
- Don't invent parallel color shortcuts per repo; match this token ladder when editing `uno.config.ts`.
- Don't require every app to define every shortcut — Classify keeps `btn-label*`; Segment keeps `tool-btn` / `menu-*`; shared chrome shortcuts must match.
- Don't move Classify labels under the image.
- Don't style dialogs as airy marketing cards; reuse strip header/footer + `dialog-*` shortcuts.
