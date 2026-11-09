// Blog: cada artículo es un .md en src/lib/blog/posts/ (el nombre del archivo es la URL).
// Arriba lleva datos entre --- (title, description, date, category, author, authorRole, resumen).
// El texto admite: ## y ### títulos, párrafos, listas con - o 1., **negrita**, *cursiva*,
// [enlaces](url), imágenes en su propia línea  ![texto alternativo](/blog/<slug>/foto.webp "pie de foto")
// y cajas destacadas:  > [!tip] Título   /  > [!warn] …  /  > [!flowpass] …
// Imágenes: guardarlas en static/blog/<slug>/ en .webp (livianas, máx ~1200px de ancho).
// Portada opcional en los datos de arriba:  cover: /blog/<slug>/portada.webp

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  category: string;
  author: string;
  authorRole?: string;
  resumen: string;
  cover?: string;
  minutes: number;
  html: string;
  text: string;
};

const files = import.meta.glob('./posts/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function inline(s: string): string {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, href) => {
      const ext = /^https?:/.test(href);
      return `<a href="${href}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ''}>${t}</a>`;
    });
}

const slugify = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function render(md: string): string {
  const lines = md.replace(/\r/g, '').split('\n');
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    let m: RegExpMatchArray | null;
    if ((m = line.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)\s*$/))) {
      const cap = m[3] ? `<figcaption>${inline(m[3])}</figcaption>` : '';
      out.push(`<figure><img src="${esc(m[2])}" alt="${esc(m[1])}" loading="lazy" decoding="async" />${cap}</figure>`);
      i++;
    } else if ((m = line.match(/^(#{2,3})\s+(.*)$/))) {
      const lvl = m[1].length;
      out.push(`<h${lvl} id="${slugify(m[2])}">${inline(m[2])}</h${lvl}>`);
      i++;
    } else if (line.startsWith('>')) {
      const block: string[] = [];
      while (i < lines.length && lines[i].startsWith('>')) block.push(lines[i++].replace(/^>\s?/, ''));
      const head = block[0].match(/^\[!(tip|warn|flowpass)\]\s*(.*)$/);
      const kind = head ? head[1] : 'note';
      const title = head ? head[2] : '';
      const body = (head ? block.slice(1) : block).join(' ');
      out.push(`<aside class="callout ${kind}">${title ? `<p class="callout-title">${inline(title)}</p>` : ''}<p>${inline(body)}</p></aside>`);
    } else if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) items.push(`<li>${inline(lines[i++].replace(/^\s*[-*]\s+/, ''))}</li>`);
      out.push(`<ul>${items.join('')}</ul>`);
    } else if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) items.push(`<li>${inline(lines[i++].replace(/^\s*\d+\.\s+/, ''))}</li>`);
      out.push(`<ol>${items.join('')}</ol>`);
    } else {
      const para: string[] = [];
      while (i < lines.length && lines[i].trim() && !/^(#{2,3}\s|>|!\[|\s*[-*]\s|\s*\d+\.\s)/.test(lines[i])) para.push(lines[i++]);
      out.push(`<p>${inline(para.join(' '))}</p>`);
    }
  }
  return out.join('\n');
}

function parse(path: string, raw: string): Post {
  const slug = path.split('/').pop()!.replace(/\.md$/, '');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const meta: Record<string, string> = {};
  for (const l of (m?.[1] ?? '').split('\n')) {
    const k = l.match(/^(\w+):\s*(.*)$/);
    if (k) meta[k[1]] = k[2].trim();
  }
  const body = m?.[2] ?? raw;
  const text = body.replace(/[#>*_[\]()!-]/g, ' ').replace(/\s+/g, ' ').trim();
  return {
    slug,
    title: meta.title ?? slug,
    description: meta.description ?? '',
    date: meta.date ?? '',
    updated: meta.updated,
    category: meta.category ?? 'Guías',
    author: meta.author ?? 'Equipo FlowPass',
    authorRole: meta.authorRole,
    resumen: meta.resumen ?? '',
    cover: meta.cover || undefined,
    minutes: Math.max(1, Math.round(text.split(' ').length / 200)),
    html: render(body),
    text
  };
}

export const posts: Post[] = Object.entries(files)
  .map(([p, raw]) => parse(p, raw))
  .sort((a, b) => b.date.localeCompare(a.date));

export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug);

export const fechaLarga = (iso: string) =>
  new Date(iso + 'T12:00:00Z').toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
