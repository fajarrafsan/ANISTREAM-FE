import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, unlink, rmdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildSitemap, refreshSitemap, createDetailShell, SITE_URL } from './seo.mjs';

test('sitemap uses real IDs, deduplicates, and includes only public detail routes', () => {
    const xml = buildSitemap({ success: true, data: [{ animeList: [
        { title: 'One Piece', animeId: 'one-piece' },
        { title: 'Naruto', animeId: 'naruto' },
        { title: 'Duplicate', animeId: 'one-piece' },
    ] }] });
    assert.equal((xml.match(/<loc>/g) || []).length, 3);
    assert(xml.includes(`<loc>${SITE_URL}anime/detail/one-piece</loc>`));
    assert(!xml.includes('/profile'));
    assert(!xml.includes('/episode/'));
    for (const animeId of ['../profile', 'https://other.test', 'x</loc>', '', null]) {
        assert.throws(() => buildSitemap({success:true,data:[{animeList:[{animeId}]}]}));
    }
});

test('upstream 403, empty feed, and malformed response preserve the saved sitemap', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'anistream-seo-'));
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
    assert(shell.includes('<title>Detail Anime | AniStream</title>'));
    assert(shell.includes('content="index, follow"'));
    assert(shell.includes('src="/src/main.jsx"'));
    assert(!shell.includes('rel="canonical"'));
    assert(!shell.includes('website-structured-data'));
    assert(!shell.includes('property="og:url"'));
});
