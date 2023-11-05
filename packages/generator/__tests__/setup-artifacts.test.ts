import { describe, expect, test } from 'vitest'
import { Generator } from '../src'
import { generatorConfig } from './fixture'
import { Artifact } from '@pandacss/types'

const formatArtifact = (artifact: Artifact) => {
  if (!artifact) return
  const dir = artifact.dir ?? []
  return artifact.files.map((f) => dir + '/' + f.file)
}

describe('setup-artifacts', () => {
  test('filter by ArtifactId', () => {
    const generator = new Generator(generatorConfig)
    expect(generator.getArtifacts(['create-recipe']).map(formatArtifact)).toMatchInlineSnapshot(`
      [
        [
          "recipes/create-recipe.mjs",
          "recipes/create-recipe.d.ts",
        ],
      ]
    `)
    expect(generator.getArtifacts(['create-recipe', 'css-fn']).map(formatArtifact)).toMatchInlineSnapshot(`
      [
        [
          "css/conditions.mjs",
          "css/css.mjs",
          "css/css.d.ts",
        ],
        [
          "recipes/create-recipe.mjs",
          "recipes/create-recipe.d.ts",
        ],
      ]
    `)
    expect(generator.getArtifacts(['recipes']).map(formatArtifact)).toMatchInlineSnapshot(`
      [
        [
          "recipes/text-style.mjs",
          "recipes/text-style.d.ts",
          "recipes/tooltip-style.mjs",
          "recipes/tooltip-style.d.ts",
          "recipes/button-style.mjs",
          "recipes/button-style.d.ts",
          "recipes/index.mjs",
          "recipes/index.d.ts",
        ],
      ]
    `)
    expect(generator.getArtifacts(['recipes', 'recipes.button-style']).map(formatArtifact)).toMatchInlineSnapshot(`
      [
        [
          "recipes/button-style.mjs",
          "recipes/button-style.d.ts",
          "recipes/index.mjs",
          "recipes/index.d.ts",
        ],
      ]
    `)
    expect(generator.getArtifacts(['recipes', 'recipes.button-style', 'recipes.tooltip-style']).map(formatArtifact))
      .toMatchInlineSnapshot(`
        [
          [
            "recipes/tooltip-style.mjs",
            "recipes/tooltip-style.d.ts",
            "recipes/button-style.mjs",
            "recipes/button-style.d.ts",
            "recipes/index.mjs",
            "recipes/index.d.ts",
          ],
        ]
      `)
    expect(generator.getArtifacts(['patterns']).map(formatArtifact)).toMatchInlineSnapshot(`
      [
        [
          "patterns/box.mjs",
          "patterns/box.d.ts",
          "patterns/flex.mjs",
          "patterns/flex.d.ts",
          "patterns/stack.mjs",
          "patterns/stack.d.ts",
          "patterns/vstack.mjs",
          "patterns/vstack.d.ts",
          "patterns/hstack.mjs",
          "patterns/hstack.d.ts",
          "patterns/spacer.mjs",
          "patterns/spacer.d.ts",
          "patterns/square.mjs",
          "patterns/square.d.ts",
          "patterns/circle.mjs",
          "patterns/circle.d.ts",
          "patterns/center.mjs",
          "patterns/center.d.ts",
          "patterns/link-box.mjs",
          "patterns/link-box.d.ts",
          "patterns/link-overlay.mjs",
          "patterns/link-overlay.d.ts",
          "patterns/aspect-ratio.mjs",
          "patterns/aspect-ratio.d.ts",
          "patterns/grid.mjs",
          "patterns/grid.d.ts",
          "patterns/grid-item.mjs",
          "patterns/grid-item.d.ts",
          "patterns/wrap.mjs",
          "patterns/wrap.d.ts",
          "patterns/container.mjs",
          "patterns/container.d.ts",
          "patterns/divider.mjs",
          "patterns/divider.d.ts",
          "patterns/float.mjs",
          "patterns/float.d.ts",
          "patterns/bleed.mjs",
          "patterns/bleed.d.ts",
          "patterns/visually-hidden.mjs",
          "patterns/visually-hidden.d.ts",
        ],
      ]
    `)

    expect(generator.getArtifacts(['patterns.box']).map(formatArtifact)).toMatchInlineSnapshot('[]')
    expect(generator.getArtifacts(['patterns', 'patterns.box']).map(formatArtifact)).toMatchInlineSnapshot(`
      [
        [
          "patterns/box.mjs",
          "patterns/box.d.ts",
        ],
      ]
    `)
  })

  test('getArtifacts', () => {
    const generator = new Generator(generatorConfig)
    expect(generator.getArtifacts().map(formatArtifact)).toMatchInlineSnapshot(`
      [
        [
          "/helpers.mjs",
        ],
        [
          "tokens/index.css",
          "tokens/index.d.ts",
          "tokens/index.mjs",
          "tokens/tokens.d.ts",
        ],
        [
          "tokens/keyframes.css",
        ],
        [],
        [
          "types/global.d.ts",
          "types/index.d.ts",
        ],
        [
          "types/prop-type.d.ts",
          "types/style-props.d.ts",
        ],
        [
          "types/conditions.d.ts",
        ],
        [
          "types/csstype.d.ts",
          "types/selectors.d.ts",
          "types/composition.d.ts",
          "types/recipe.d.ts",
          "types/pattern.d.ts",
          "types/parts.d.ts",
        ],
        [
          "types/system-types.d.ts",
        ],
        [
          "css/conditions.mjs",
          "css/css.mjs",
          "css/css.d.ts",
        ],
        [
          "css/cva.mjs",
          "css/cva.d.ts",
        ],
        [
          "css/sva.mjs",
          "css/sva.d.ts",
        ],
        [
          "css/cx.mjs",
          "css/cx.d.ts",
        ],
        [
          "recipes/create-recipe.mjs",
          "recipes/create-recipe.d.ts",
        ],
        [
          "recipes/index.mjs",
          "recipes/index.d.ts",
        ],
        [
          "recipes/text-style.mjs",
          "recipes/text-style.d.ts",
          "recipes/tooltip-style.mjs",
          "recipes/tooltip-style.d.ts",
          "recipes/button-style.mjs",
          "recipes/button-style.d.ts",
          "recipes/index.mjs",
          "recipes/index.d.ts",
        ],
        [
          "patterns/index.mjs",
          "patterns/index.d.ts",
        ],
        [
          "patterns/box.mjs",
          "patterns/box.d.ts",
          "patterns/flex.mjs",
          "patterns/flex.d.ts",
          "patterns/stack.mjs",
          "patterns/stack.d.ts",
          "patterns/vstack.mjs",
          "patterns/vstack.d.ts",
          "patterns/hstack.mjs",
          "patterns/hstack.d.ts",
          "patterns/spacer.mjs",
          "patterns/spacer.d.ts",
          "patterns/square.mjs",
          "patterns/square.d.ts",
          "patterns/circle.mjs",
          "patterns/circle.d.ts",
          "patterns/center.mjs",
          "patterns/center.d.ts",
          "patterns/link-box.mjs",
          "patterns/link-box.d.ts",
          "patterns/link-overlay.mjs",
          "patterns/link-overlay.d.ts",
          "patterns/aspect-ratio.mjs",
          "patterns/aspect-ratio.d.ts",
          "patterns/grid.mjs",
          "patterns/grid.d.ts",
          "patterns/grid-item.mjs",
          "patterns/grid-item.d.ts",
          "patterns/wrap.mjs",
          "patterns/wrap.d.ts",
          "patterns/container.mjs",
          "patterns/container.d.ts",
          "patterns/divider.mjs",
          "patterns/divider.d.ts",
          "patterns/float.mjs",
          "patterns/float.d.ts",
          "patterns/bleed.mjs",
          "patterns/bleed.d.ts",
          "patterns/visually-hidden.mjs",
          "patterns/visually-hidden.d.ts",
        ],
        [],
        [],
        [],
        [],
        [],
        [
          "css/index.mjs",
          "css/index.d.ts",
        ],
        [],
        [
          "/global.css",
        ],
        [
          "/static.css",
        ],
        [],
      ]
    `)
  })
})
