// Standalone, one-off tool. Scans src/assets/gallery for photos whose
// filename references a known photographer and burns a "© Name" credit
// into the bottom-right corner.
// By default output goes to src/assets/gallery-credited/ (originals untouched);
// pass --in-place to overwrite the source photos directly instead.
//
// Usage:
//   node scripts/add-photo-credits.mjs                process every match
//   node scripts/add-photo-credits.mjs --limit 1      process only the first N matches (dry-run style check)
//   node scripts/add-photo-credits.mjs --file <path-relative-to-src/assets/gallery>   process one specific file
//   node scripts/add-photo-credits.mjs --in-place     overwrite the originals instead of writing to gallery-credited/
import { readdir, mkdir, rename } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const SRC = path.join(ROOT, 'src', 'assets', 'gallery')
const OUT = path.join(ROOT, 'src', 'assets', 'gallery-credited')

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png'])

// matched against the filename with accents stripped and lowercased
const PHOTOGRAPHERS = [
  { pattern: /cesarburton/, name: 'César Burton' },
  { pattern: /zoemdx/, name: 'Zoe Mdx' },
]

function stripDiacritics(str) {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function detectPhotographer(filename) {
  const normalized = stripDiacritics(filename).toLowerCase()
  return PHOTOGRAPHERS.find((p) => p.pattern.test(normalized))?.name ?? null
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (full === OUT) continue
      files.push(...(await walk(full)))
    } else if (IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) {
      files.push(full)
    }
  }
  return files
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

async function stampCredit(sourcePath, name, inPlace) {
  const image = sharp(sourcePath)
  const { width, height } = await image.metadata()
  if (!width || !height) throw new Error(`Could not read dimensions for ${sourcePath}`)

  const fontSize = Math.max(28, Math.min(80, Math.round(width * 0.035)))
  const label = `© ${name}`
  const paddingX = Math.round(fontSize * 0.7)
  const paddingY = Math.round(fontSize * 0.5)
  const boxWidth = Math.round(label.length * fontSize * 0.62) + paddingX * 2
  const boxHeight = fontSize + paddingY * 2
  const margin = Math.round(fontSize * 0.8)

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="${width - boxWidth - margin}"
        y="${height - boxHeight - margin}"
        width="${boxWidth}"
        height="${boxHeight}"
        rx="6"
        fill="black"
        fill-opacity="0.55"
      />
      <text
        x="${width - margin - boxWidth / 2}"
        y="${height - margin - boxHeight / 2}"
        font-family="sans-serif"
        font-size="${fontSize}"
        fill="white"
        text-anchor="middle"
        dominant-baseline="central"
      >${escapeXml(label)}</text>
    </svg>
  `

  const finalPath = inPlace ? sourcePath : path.join(OUT, path.relative(SRC, sourcePath))
  await mkdir(path.dirname(finalPath), { recursive: true })

  // sharp can't read and write the same file at once, so write to a temp
  // file and swap it into place afterwards when overwriting in place
  const writePath = inPlace ? `${sourcePath}.tmp` : finalPath
  await image
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .toFile(writePath)
  if (inPlace) await rename(writePath, finalPath)

  console.log(`  [${name}] ${path.relative(ROOT, sourcePath)} -> ${path.relative(ROOT, finalPath)}${inPlace ? ' (in place)' : ''}`)
}

async function main() {
  const args = process.argv.slice(2)
  const limitIdx = args.indexOf('--limit')
  const limit = limitIdx !== -1 ? Number(args[limitIdx + 1]) : Infinity
  const fileIdx = args.indexOf('--file')
  const onlyFile = fileIdx !== -1 ? path.join(SRC, args[fileIdx + 1]) : null
  const inPlace = args.includes('--in-place')

  const candidates = onlyFile ? [onlyFile] : await walk(SRC)

  let processed = 0
  for (const file of candidates) {
    if (processed >= limit) break
    const name = detectPhotographer(path.basename(file))
    if (!name) continue
    await stampCredit(file, name, inPlace)
    processed += 1
  }

  console.log(`Done. ${processed} photo(s) credited${inPlace ? ' in place' : ` -> ${path.relative(ROOT, OUT)}/`}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
