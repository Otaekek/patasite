import { Marked } from 'marked'

// Markdown sources and the figures they reference, bundled by Vite at build time.
const sources = import.meta.glob('../content/diy/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const assets = import.meta.glob('../content/diy/**/*.{png,jpg,jpeg,gif,webp,svg,avif}', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/** Resolve an image path from a markdown file to a bundled URL (or keep external URLs). */
function resolveImage(href: string): string {
  if (/^(https?:)?\/\//.test(href) || href.startsWith('data:')) return href
  const rel = href.replace(/^\.\//, '').replace(/^\/+/, '')
  return assets[`../content/diy/${rel}`] ?? href
}

const marked = new Marked({
  renderer: {
    // ![caption](path "optional title") -> <figure> with a caption
    image({ href, title, text }) {
      const caption = title || text
      return (
        `<figure><img src="${escapeHtml(resolveImage(href))}" alt="${escapeHtml(text)}" loading="lazy" />` +
        (caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : '') +
        `</figure>`
      )
    },
  },
})

/** Returns the rendered HTML for a project, or null if it has no markdown file. */
export function renderProject(id: string): string | null {
  const source = sources[`../content/diy/${id}.md`]
  return source === undefined ? null : (marked.parse(source, { async: false }) as string)
}
