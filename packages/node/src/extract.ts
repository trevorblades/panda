import { logger } from '@pandacss/logger'
import { createBox } from './cli-box'
import type { PandaContext } from './create-context'
import { writeFile } from 'fs/promises'
import { createParserResult } from '@pandacss/parser'
import { match } from 'ts-pattern'
import { optimizeCss } from '@pandacss/core'

/**
 * Bundles all the included files CSS into outdir/styles.css
 * And import the root CSS artifacts files (global, static, reset, tokens, keyframes) in there
 */
export async function bundleStyleChunksWithImports(ctx: PandaContext) {
  const files = ctx.chunks.getFiles()
  await ctx.output.write({
    dir: ctx.paths.root,
    files: [{ file: 'styles.css', code: ctx.getCss({ files }) }],
  })
  return { files, msg: ctx.messages.buildComplete(files.length) }
}

/**
 * Writes in outdir/chunks/{file}.css
 */
export async function writeFileChunk(ctx: PandaContext, file: string) {
  const { path } = ctx.runtime
  logger.debug('chunk:write', `File: ${path.relative(ctx.config.cwd, file)}`)

  const css = extractFile(ctx, file)
  if (!css) return

  const artifact = ctx.chunks.getArtifact(file, css)
  return ctx.output.write(artifact)
}

/**
 * Parse a file and return the corresponding css
 */
export function extractFile(ctx: PandaContext, relativeFile: string) {
  const {
    runtime: { path },
    config: { cwd },
  } = ctx
  const file = path.abs(cwd, relativeFile)
  logger.debug('file:extract', file)

  try {
    const measure = logger.time.debug(`Parsed ${file}`)
    const result = ctx.project.parseSourceFile(file)
    measure()
    return result
  } catch (error) {
    logger.error('file:extract', error)
  }
}

/**
 * Writes all the css chunks in outdir/chunks/{file}.css
 */
function writeChunks(ctx: PandaContext) {
  return Promise.allSettled(ctx.getFiles().map((file) => writeFileChunk(ctx, file)))
}

const randomWords = ['Sweet', 'Divine', 'Pandalicious', 'Super']
const pickRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]

export async function emitArtifacts(ctx: PandaContext) {
  if (ctx.config.clean) ctx.output.empty()

  await Promise.allSettled(ctx.getArtifacts().map(ctx.output.write))

  void ctx.hooks.callHook('generator:done')

  return {
    box: createBox({
      content: ctx.messages.codegenComplete(),
      title: `🐼 ${pickRandom(randomWords)}! ✨`,
    }),
    msg: ctx.messages.artifactsGenerated(),
  }
}

export async function emitArtfifactsAndCssChunks(ctx: PandaContext) {
  await emitArtifacts(ctx)
  if (ctx.config.emitTokensOnly) {
    return { msg: 'Successfully rebuilt the css variables and js function to query your tokens ✨' }
  }
  return writeAndBundleCssChunks(ctx)
}

/**
 * Writes all the css chunks in outdir/chunks/{file}.css
 * and bundles them in outdir/styles.css
 */
export async function writeAndBundleCssChunks(ctx: PandaContext) {
  await writeChunks(ctx)
  return bundleStyleChunksWithImports(ctx)
}

/**
 * Bundles all the included files CSS into the given outfile
 * Including the root CSS artifact files content (global, static, reset, tokens, keyframes)
 * Without any imports
 */
export async function bundleCss(ctx: PandaContext, outfile: string, resolve = true) {
  const minify = ctx.config.minify
  const collector = createParserResult(ctx.parserOptions)
  const files = ctx.getFiles().map((file) => {
    const result = extractFile(ctx, file)
    if (result) {
      collector.mergeStyles(result)
    }
  })

  const parserCss = ctx.getParserCss(collector)
  const css = optimizeCss(ctx.getCss({ files: [parserCss ?? ''], resolve }), { minify })

  await writeFile(outfile, css)
  return { files, msg: ctx.messages.buildComplete(files.length) }
}

/**
 * Bundles all the files CSS into outdir/chunks/{file}.css
 * Without writing any chunks or needing any imports
 */
export async function bundleMinimalFilesCss(ctx: PandaContext, outfile: string) {
  const files = ctx.getFiles()
  const filesWithCss = []

  const collector = createParserResult(ctx)

  files.forEach((file) => {
    const measure = logger.time.debug(`Parsed ${file}`)
    const result = ctx.project.parseSourceFile(file)

    measure()
    if (!result) return

    collector.merge(result)
    filesWithCss.push(file)
  })

  const css = ctx.getParserCss(collector)
  if (!css) return { files, msg: ctx.messages.buildComplete(files.length) }

  const minify = ctx.config.minify
  await writeFile(outfile, optimizeCss(css, { minify }))
  return { files, msg: ctx.messages.buildComplete(files.length) }
}

export type CssArtifactType = 'preflight' | 'tokens' | 'static' | 'global' | 'keyframes'

/**
 * Generates the CSS for a given artifact type
 */
export async function generateCssArtifactOfType(ctx: PandaContext, cssType: CssArtifactType, outfile: string) {
  let notFound = false
  const css = match(cssType)
    .with('preflight', () => ctx.getResetCss(ctx))
    .with('tokens', () => ctx.getTokenCss(ctx))
    .with('static', () => ctx.getStaticCss(ctx))
    .with('global', () => ctx.getGlobalCss(ctx))
    .with('keyframes', () => ctx.getKeyframeCss(ctx))
    .otherwise(() => {
      notFound = true
    })

  if (notFound) return { msg: `No css artifact of type <${cssType}> was found` }
  if (!css) return { msg: `No css to generate for type <${cssType}>` }

  const minify = ctx.config.minify
  await writeFile(outfile, optimizeCss(css, { minify }))
  return { msg: `Successfully generated ${cssType} css artifact ✨` }
}
