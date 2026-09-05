import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import process from 'node:process';

export const SITE_URL = 'https://rafsanime.fajarrafsan.my.id/';
const root = fileURLToPath(new URL('../', import.meta.url));
const sitemapFile = resolve(root, 'public/sitemap.xml');
const apiUrl = 'https://anistreasm-be.onrender.com/api/anime/all';

function normalizeSlug(value) {
    if (typeof value !== 'string' || !value) throw new Error('ID anime kosong.');
    let decoded;
    try {
        decoded = decodeURIComponent(value);
    } catch {
        throw new Error('ID anime memiliki encoding URL yang rusak.');
    }
    const hasControlCharacter = [...decoded].some(character => character.codePointAt(0) <= 31);
    if (decoded.trim() !== decoded || decoded === '.' || decoded === '..' || /[/\\?#]/.test(decoded) || hasControlCharacter) {
        throw new Error('ID anime bukan satu segmen URL yang aman.');
    }
    return encodeURIComponent(decoded);
}

// Slug -> judul, dipakai sitemap sekaligus halaman detail pra-render.
export function collectAnime(response) {
    if (response?.success !== true || !Array.isArray(response.data)) {
        throw new Error('Respons daftar anime tidak valid.');
    }
    const bySlug = new Map();
    for (const group of response.data) {
        if (!Array.isArray(group.animeList)) throw new Error('Grup daftar anime tidak valid.');
        for (const anime of group.animeList) {
            // Keep already encoded Unicode slugs canonical without double encoding.
            const slug = normalizeSlug(anime.animeId);
            if (!bySlug.has(slug)) bySlug.set(slug, typeof anime.title === 'string' ? anime.title.trim() : '');
        }
    }
    return bySlug;
}

export function buildSitemap(response) {
    const bySlug = collectAnime(response);
    const slugs = new Set(bySlug.keys());
    if (!slugs.size) throw new Error('Daftar anime kosong; sitemap lama dipertahankan.');
    if (slugs.size >= 50000) throw new Error('Sitemap perlu dibagi sebelum melebihi batas 50.000 URL.');
    const urls = [SITE_URL, ...[...slugs].sort().map(slug => `${SITE_URL}anime/detail/${slug}`)];
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`;
}

export async function refreshSitemap({ fetchImpl = fetch, outputFile = sitemapFile } = {}) {
    const response = await fetchImpl(apiUrl, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`API daftar anime mengembalikan HTTP ${response.status}.`);
    const payload = await response.json();
    const xml = buildSitemap(payload);
    // Never replace the last sitemap with an error body or an incomplete empty feed.
    await writeFile(outputFile, xml, 'utf8');
    return { xml, anime: collectAnime(payload) };
}

// Judul dari sitemap tersimpan tidak tersedia, jadi slug jadi sumbernya.
export function animeFromSitemap(xml) {
    const prefix = `${SITE_URL}anime/detail/`;
    const bySlug = new Map();
    for (const [, loc] of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
        if (loc.startsWith(prefix)) bySlug.set(loc.slice(prefix.length), '');
    }
    return bySlug;
}

export function createDetailShell(html) {
    return html
        .replace(/<title>[\s\S]*?<\/title>/, '<title>Detail Anime | Rafsanime</title>')
        .replace(/\s*<link\b[^>]*rel="canonical"[^>]*>/g, '')
        .replace(/\s*<script\b[^>]*id="website-structured-data"[^>]*>[\s\S]*?<\/script>/g, '')
        .replace(/\s*<meta\b[^>]*(?:name|property)="(?:description|og:title|og:description|og:url|twitter:title|twitter:description)"[^>]*>/g, '');
}

// Hanya slug ASCII sederhana yang dipra-render. Slug ber-encoding persen
// memetakan ke nama berkas yang penanganannya berbeda antar host, dan salah
// nama berarti halaman tidak tersaji sama sekali; sisanya jatuh ke cangkang.
export const isPrerenderableSlug = (slug) => /^[a-z0-9][a-z0-9-]*$/i.test(slug);

const escapeAttribute = (value) => value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

// Satu berkas per anime dengan judul, deskripsi dan canonical sendiri.
// Tanpa ini semua 760 halaman detail dirayapi dengan judul identik, dan
// Google memperlakukan halaman berjudul duplikat sebagai tidak layak indeks.
export function createDetailPage(html, { slug, title }) {
    const name = escapeAttribute((title || slug.replace(/-/g, ' ')).trim());
    const url = `${SITE_URL}anime/detail/${slug}`;
    const pageTitle = `${name} Sub Indo — Nonton & Download | Rafsanime`;
    const description = `Nonton ${name} subtitle Indonesia di Rafsanime. Lihat sinopsis, daftar episode, skor, dan tautan unduhan batch.`;

    const head = [
        `<title>${pageTitle}</title>`,
        `<meta name="description" content="${description}" />`,
        `<link rel="canonical" href="${url}" />`,
        `<meta property="og:title" content="${pageTitle}" />`,
        `<meta property="og:description" content="${description}" />`,
        `<meta property="og:url" content="${url}" />`,
        `<meta name="twitter:title" content="${pageTitle}" />`,
        `<meta name="twitter:description" content="${description}" />`,
        `<script type="application/ld+json">${JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TVSeries',
            name,
            url,
            inLanguage: 'id-ID',
        })}</script>`,
    ].join(`
  `);

    return createDetailShell(html).replace(/<title>[\s\S]*?<\/title>/, head);
}

async function main() {
    const build = process.argv.includes('--build');
    let xml;
    let anime;
    try {
        ({ xml, anime } = await refreshSitemap());
        console.log(`Sitemap diperbarui: ${(xml.match(/<loc>/g) || []).length} URL publik.`);
    } catch (error) {
        if (!build) throw error;
        xml = await readFile(sitemapFile, 'utf8');
        anime = animeFromSitemap(xml);
        if (!xml.includes(`<loc>${SITE_URL}</loc>`) || !xml.includes('</urlset>')) throw error;
        console.warn(`[SEO] ${error.message} Build menggunakan sitemap tersimpan. Jalankan pnpm seo:sitemap setelah API pulih dan deploy ulang.`);
    }
    if (build) {
        const html = await readFile(resolve(root, 'dist/index.html'), 'utf8');
        // Cangkang tetap ada untuk slug yang tidak dipra-render.
        await writeFile(resolve(root, 'dist/anime-detail.html'), createDetailShell(html));
        await writeFile(resolve(root, 'dist/sitemap.xml'), xml);

        const detailDir = resolve(root, 'dist/anime/detail');
        await mkdir(detailDir, { recursive: true });
        let written = 0;
        let skipped = 0;
        for (const [slug, title] of anime) {
            if (!isPrerenderableSlug(slug)) { skipped += 1; continue; }
            await writeFile(resolve(detailDir, `${slug}.html`), createDetailPage(html, { slug, title }));
            written += 1;
        }
        console.log(`Halaman detail pra-render: ${written} ditulis${skipped ? `, ${skipped} memakai cangkang` : ''}.`);
    }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    main().catch(error => { console.error(`[SEO] ${error.message}`); process.exitCode = 1; });
}
