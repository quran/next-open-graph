import { expect, test } from '@playwright/test';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const PREMADE_SHA256: Record<string, string> = {
  'og-ar.png': '6ddaab78c8a978396c933340f29adb021073d231f3d205626f9133db2fa4e987',
  'og-bn.png': '5b4d25627d9f0a107984b6d902ae45d09769553f37e9d8bc35c9829f9fc1875d',
  'og-en.png': '9558f4b232c009a642bfcd703da26663af001fd3b8194f7bc3fbc4a4e73302b2',
  'og-es.png': '729c4763c858e089dc65f8a1d7a998938ce53df654d81906e106710a7929a16b',
  'og-fa.png': 'dfaf4a954bf5f58674ea9612f93e5b0c22b71863e9037b9cbee66c5ffd0a66db',
  'og-fr.png': '943f64ca3cfc549b065ab1d2c0851f0eb6a7b2db463415df87a5b5807f63c4bd',
  'og-id.png': 'd5f094b527a3c55d1a4e9ba0604d447b2b106f5ee47fe9559f1733aea72e9b8f',
  'og-ms.png': '710589bd3197017dc64335fdfd95f693b18ca39b2e41a74fab2b697f62a50560',
  'og-nl.png': '2749ecb782bd3ca26a005f5589ca9c10f306b9782c68f6b706d08beb52b8caa5',
  'og-sw.png': '765728128ff07bf31a81e0ee0aa105ae5e444ae2bb4392aabf70015ffbbe10ca',
  'og-tr.png': '38e17f62a62bfcd1c2037bae732e3d849ae76968f00cb9dc64c3bde1766a0b3d',
  'og-ur.png': 'b352971ed1101f1c4307d5faece63009426f38331a7c5e06e8676077f6941e96',
  'og-vi.png': '19f9c2af277bb34c78a5e7c01e029821b918781ac7e51a91bd7c13964318aa1e',
  'og_about_en.png': '24b589d2af7fed3e65b1efccdd084fe007e3f679aca176cde3bba46e21174723',
  'og_beyond_ramadan.png': 'cd25495585ff06e0312099eb6148683ead201b6217b9eb7fd05a71a3c87c14b5',
  'og_calendar.png': 'd84fc5f5852eb2f5cf66960f33a33686e6e40144a997c1e24a5414faeeee9fe5',
  'og_daily.png': 'd71b3b5b508151435481d9fdba904da04505b2fe1d419851281bacd1c4f7bae2',
  'og_embed.png': '41f337c61c42c2be1e7039c0d63131cf22a5b4d0ef7f31f9de32a2735f86706c',
  'og_explore_answers.png': '1e18900fe16d6a4e1aa7fd171d2f0d5e482aaa2c1be356b36838af73f1abf8c1',
  'og_learning_plans.png': '44f58fcbbdd8812c46c2630ff159b396fb0ec94f874f9c12eada36adaf8afdc5',
  'og_media.png': '0fe407117bec31f3e15ce6e37ba42bb60aa3f4af8903933b78123c8d6597993e',
  'og_preparing_for_ramadan.png': '5e27c8afc63614dfa9c2398f0d46d8e592daa58742213ef1211b49d89eaf1a58',
  'og_quran_reader_study_mode_hadith.png':
    'da591c114ce7e840c26eff906fd8edca30bf39e5c744c7cdb68fbb6ad6191147',
  'og_quran_reader_study_mode_layers.png':
    '2302ef99a41615f179dc2106878f8dd7c93e98a8d28273ee26e0bf2a0b0f2401',
  'og_quran_reader_study_mode_lessons.png':
    '57ea14b22cd2a0a189e160c22f5c2f39351c7fe47cfbe622f0369518749f6064',
  'og_quran_reader_study_mode_qiraat.png':
    'c9f20bfc6b61ff6ec8b3a1e2d6572bfee87cda911754320ee5bcb6e61fc0a6ec',
  'og_quran_reader_study_mode_reflections.png':
    '0d109b315fb084840803b3a65aff6b7f6a8fe7c03fa7112bdf56c78849c52f11',
  'og_quran_reader_study_mode_related_verses.png':
    '33a09b32e27c881d47d9b5d2f162005c3253a0b0ee1b1d329734a7939b124488',
  'og_quran_reader_study_mode_tafsir.png':
    '02be59dd1f1f995dd15f4e7b42d546d60a380bff3d5fd5eba9b52058ccc4fac7',
  'og_ramadan2026.png': '57be846472a91d34465122b1d6772891179e8bc63637af89441263c233fee140',
  'og_ramadanchallenge.png': '18294847ad07fdb4cb1a9345f00310782cc9f1270e525f2d471d827ebb87bd17',
  'og_what_is_ramadan.png': '7970f79175824799df6648e8937717a8e5e8b8a4ebd212fd6e84b9954448413a',
};

const MAX_PREMADE_TOTAL_BYTES = 3_200_000;

test('generated Open Graph images use the official QDC horizontal logo', () => {
  const logoSource = fs.readFileSync(path.join(process.cwd(), 'src/components/Logo.tsx'), 'utf8');
  const logo = fs.readFileSync(path.join(process.cwd(), 'public/qdc-horizontal-dark.png'));

  expect(crypto.createHash('sha256').update(logo).digest('hex')).toBe(
    '2dae9cbd6c36cd8a6ece6015141bcca65e93fe8f2dbff0002253394ca2bdf0f3',
  );
  expect(logoSource).toContain('src={src}');
  expect(logoSource).toContain("objectFit: 'contain'");
});

test('all reviewed premade Open Graph images retain their approved QDC branding', () => {
  Object.entries(PREMADE_SHA256).forEach(([fileName, expectedHash]) => {
    const image = fs.readFileSync(path.join(process.cwd(), 'public/premade', fileName));
    expect(crypto.createHash('sha256').update(image).digest('hex'), fileName).toBe(expectedHash);
  });
});

test('premade Open Graph images stay within their existing payload budget', () => {
  const totalBytes = Object.keys(PREMADE_SHA256).reduce((total, fileName) => {
    return total + fs.statSync(path.join(process.cwd(), 'public/premade', fileName)).size;
  }, 0);

  expect(totalBytes).toBeLessThanOrEqual(MAX_PREMADE_TOTAL_BYTES);
});
