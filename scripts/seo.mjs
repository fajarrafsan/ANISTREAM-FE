import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import process from 'node:process';

export const SITE_URL = 'https://anistream.fajarrafsan.my.id/';
const root = fileURLToPath(new URL('../', import.meta.url));
const sitemapFile = resolve(root, 'public/sitemap.xml');
const apiUrl = 'https://anistreasm-be.onrender.com/api/anime/all';

export function buildSitemap(response) {
    if (response?.success !== true || !Array.isArray(response.data)) {
        throw new Error('Respons daftar anime tidak valid.');
    }
    const slugs = new Set();
    for (const group of response.data) {
        if (!Array.isArray(group.animeList)) throw new Error('Grup daftar anime tidak valid.');
        for (const anime of group.animeList) {
            const slug = anime.animeId;
            // IDs are URL segments, never arbitrary paths, external URLs, or XML.
            if (typeof slug !== 'string' || !/^[a-z0-9][a-z0-9_-]*$/i.test(slug)) {
                throw new Error('Daftar anime mengandung ID yang tidak valid.');
            }
            slugs.add(slug);
        }
    }
    if (!slugs.size) throw new Error('Daftar anime kosong; sitemap lama dipertahankan.');
    if (slugs.size >= 50000) throw new Error('Sitemap perlu dibagi sebelum melebihi batas 50.000 URL.');
    const urls = [SITE_URL, ...[...slugs].sort().map(slug => `${SITE_URL}anime/detail/${encodeURIComponent(slug)}`)];
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`;
}

export async function refreshSitemap({ fetchImpl = fetch, outputFile = sitemapFile } = {}) {
    const response = await fetchImpl(apiUrl, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`API daftar anime mengembalikan HTTP ${response.status}.`);
    const xml = buildSitemap(await response.json());
    // Never replace the last sitemap with an error body or an incomplete empty feed.
    await writeFile(outputFile, xml, 'utf8');
    return xml;
}

export function createDetailShell(html) {
    return html
        .replace(/<title>[\s\S]*?<\/title>/, '<title>Detail Anime | AniStream</title>')
        .replace(/\s*<link\b[^>]*rel="canonical"[^>]*>/g, '')
        .replace(/\s*<script\b[^>]*id="website-structured-data"[^>]*>[\s\S]*?<\/script>/g, '')
        .replace(/\s*<meta\b[^>]*(?:name|property)="(?:description|og:title|og:description|og:url|twitter:title|twitter:description)"[^>]*>/g, '');
}

async function main() {
    const build = process.argv.includes('--build');
    let xml;
    try {
        xml = await refreshSitemap();
        console.log(`Sitemap diperbarui: ${(xml.match(/<loc>/g) || []).length} URL publik.`);
    } catch (error) {
        if (!build) throw error;
        xml = await readFile(sitemapFile, 'utf8');
        if (!xml.includes(`<loc>${SITE_URL}</loc>`) || !xml.includes('</urlset>')) throw error;
        console.warn(`[SEO] ${error.message} Build menggunakan sitemap tersimpan. Jalankan pnpm seo:sitemap setelah API pulih dan deploy ulang.`);
    }
    if (build) {
        const html = await readFile(resolve(root, 'dist/index.html'), 'utf8');
        await writeFile(resolve(root, 'dist/anime-detail.html'), createDetailShell(html));
        await writeFile(resolve(root, 'dist/sitemap.xml'), xml);
    }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    main().catch(error => { console.error(`[SEO] ${error.message}`); process.exitCode = 1; });
}
