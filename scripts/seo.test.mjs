import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, unlink, rmdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildSitemap, refreshSitemap, createDetailShell, createDetailPage, animeFromSitemap, isPrerenderableSlug, collectAnime, SITE_URL } from './seo.mjs';

test('sitemap uses real IDs, deduplicates, and includes only public detail routes', () => {
    const xml = buildSitemap({ success: true, data: [{ animeList: [
        { title: 'One Piece', animeId: 'one-piece' },
        { title: 'Naruto', animeId: 'naruto' },
        { title: 'Duplicate', animeId: 'one-piece' },
        { title: 'Unicode slug', animeId: 'ranma-%c2%bd-2024' },
    ] }] });
    assert.equal((xml.match(/<loc>/g) || []).length, 4);
    assert(xml.includes(`<loc>${SITE_URL}anime/detail/one-piece</loc>`));
    assert(xml.includes(`<loc>${SITE_URL}anime/detail/ranma-%C2%BD-2024</loc>`));
    assert(!xml.includes('/profile'));
    assert(!xml.includes('/episode/'));
    for (const animeId of ['../profile', 'https://other.test', 'x</loc>', '', null]) {
        assert.throws(() => buildSitemap({success:true,data:[{animeList:[{animeId}]}]}));
    }
});

test('upstream 403, empty feed, and malformed response preserve the saved sitemap', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'rafsanime-seo-'));
    const outputFile = join(dir, 'sitemap.xml');
    const saved = buildSitemap({success:true,data:[{animeList:[{animeId:'one-piece'}]}]});
    try {
        await writeFile(outputFile, saved);
        for (const response of [
            {ok:false,status:403},
            {ok:true,json:async()=>({success:true,data:[]})},
            {ok:true,json:async()=>({success:false,errors:'Unavailable'})},
        ]) {
            await assert.rejects(refreshSitemap({outputFile,fetchImpl:async()=>response}));
            assert.equal(await readFile(outputFile,'utf8'),saved);
        }
    } finally {
        await unlink(outputFile);
        await rmdir(dir);
    }
});

test('detail HTML keeps the app renderable without claiming the homepage canonical', async () => {
    const index = await readFile(new URL('../index.html', import.meta.url), 'utf8');
    const shell = createDetailShell(index);
    assert(shell.includes('<title>Detail Anime | Rafsanime</title>'));
    assert(shell.includes('content="index, follow"'));
    assert(shell.includes('src="/src/main.jsx"'));
    assert(!shell.includes('rel="canonical"'));
    assert(!shell.includes('website-structured-data'));
    assert(!shell.includes('property="og:url"'));
});

test('primary SEO signals use the Rafsanime domain and preserve the old-domain redirect', async () => {
    assert.equal(SITE_URL, 'https://rafsanime.fajarrafsan.my.id/');

    const [index, robots, sitemap, vercelSource] = await Promise.all([
        readFile(new URL('../index.html', import.meta.url), 'utf8'),
        readFile(new URL('../public/robots.txt', import.meta.url), 'utf8'),
        readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8'),
        readFile(new URL('../vercel.json', import.meta.url), 'utf8'),
    ]);
    const vercel = JSON.parse(vercelSource);

    assert(index.includes(`<link rel="canonical" href="${SITE_URL}" />`));
    assert(robots.includes(`Sitemap: ${SITE_URL}sitemap.xml`));
    assert(sitemap.includes(`<loc>${SITE_URL}</loc>`));
    assert(!sitemap.includes('https://anistream.fajarrafsan.my.id/'));
    assert.deepEqual(vercel.redirects?.[0], {
        source: '/:path*',
        has: [{ type: 'host', value: 'anistream.fajarrafsan.my.id' }],
        destination: 'https://rafsanime.fajarrafsan.my.id/:path*',
        permanent: true,
    });
});

test('each prerendered detail page carries its own title, description and canonical', async () => {
    const index = await readFile(new URL('../index.html', import.meta.url), 'utf8');
    const one = createDetailPage(index, { slug: 'one-piece', title: 'One Piece' });
    const two = createDetailPage(index, { slug: 'naruto', title: 'Naruto' });

    assert(one.includes('<title>One Piece Sub Indo'));
    assert(one.includes(`<link rel="canonical" href="${SITE_URL}anime/detail/one-piece" />`));
    assert(one.includes('name="description" content="Nonton One Piece'));
    assert(one.includes(`"@type":"TVSeries"`));
    // Judul duplikat adalah cacat yang diperbaiki ini, jadi dijaga eksplisit.
    assert.notEqual(one.match(/<title>[^<]*<\/title>/)[0], two.match(/<title>[^<]*<\/title>/)[0]);
    assert(!one.includes('Detail Anime | Rafsanime'));
    assert(one.includes('src="/src/main.jsx"'));

    // Tanpa judul dari API, slug tetap menghasilkan judul yang terbaca.
    assert(createDetailPage(index, { slug: 'black-torch', title: '' }).includes('<title>black torch Sub Indo'));
    // Kutip di judul tidak boleh memutus atribut meta.
    assert(createDetailPage(index, { slug: 'x', title: 'A "B" & C' }).includes('&quot;B&quot; &amp; C'));
});

test('only filesystem-safe slugs are prerendered, the rest keep the shell', () => {
    for (const slug of ['one-piece', 'naruto', 'classroom-of-the-elite-season-4']) {
        assert(isPrerenderableSlug(slug), slug);
    }
    for (const slug of ['ranma-%C2%BD-2024', '..', 'a/b', '-lead', 'a b', '']) {
        assert(!isPrerenderableSlug(slug), slug);
    }
});

test('a saved sitemap still yields the slug list when the API is down', () => {
    const xml = buildSitemap({ success: true, data: [{ animeList: [
        { title: 'One Piece', animeId: 'one-piece' },
        { title: 'Naruto', animeId: 'naruto' },
    ] }] });
    const anime = animeFromSitemap(xml);
    assert.deepEqual([...anime.keys()].sort(), ['naruto', 'one-piece']);
    // Beranda bukan halaman detail dan tidak boleh ikut terbawa.
    assert(!anime.has(''));
});

test('collectAnime keeps the first title for a duplicated slug', () => {
    const anime = collectAnime({ success: true, data: [{ animeList: [
        { title: 'One Piece', animeId: 'one-piece' },
        { title: 'One Piece (dup)', animeId: 'one-piece' },
    ] }] });
    assert.equal(anime.size, 1);
    assert.equal(anime.get('one-piece'), 'One Piece');
});
