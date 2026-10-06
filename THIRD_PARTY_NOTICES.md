# Third-party notices

The root `LICENSE` covers original Forjavia code only. It does not replace the licenses, copyright notices, or attribution requirements of incorporated upstream material.

## Source copied into this repository

| Material | Upstream attribution | License evidence |
| --- | --- | --- |
| `web/build/sites-vite-plugin.ts` | `@openai/sites-vite-plugin` 0.2.0; copyright 2026 OpenAI | MIT text retained in `web/build/sites-vite-plugin.LICENSE` |
| `web/vendor/shadcn-tailwind-4.13.0.css` | shadcn; copyright 2023 shadcn | MIT text retained in `web/vendor/shadcn-tailwind-4.13.0.LICENSE.md` |

Keep the upstream license files with these materials in source and in any distribution containing a substantial portion of them. The upstream attributions are not replaced by the Forjavia copyright line.

## Package dependencies

`docs/third-party-inventory.json` records every package entry and reported license expression in `web/package-lock.json`, bound to the lockfile SHA-256. Generate/check it with `node tools/third-party-inventory.mjs --write` (new file only) or `node tools/third-party-inventory.mjs --check` (read only). The lockfile inventory is a review input, not a determination of which packages ship in a release or whether each license obligation is satisfied.

Before the first public release, identify the actual shipped artifact and bundled dependencies, verify their upstream notices/license texts, fulfill attribution and other applicable conditions, and block any artifact whose provenance or permission cannot be established. Include platform-specific optional binaries in that assessment when bundled.

## Visual assets

The initial public source baseline omits the prior `web/public/` images and icons because their asset-level origin/license record was unavailable. The preview uses code-native CSS and markup instead. Do not add those assets to a public tree until their creator/rightsholder and permitted distribution terms are documented, or replace them with assets whose rights are clear. The root MIT license alone does not establish those rights.
