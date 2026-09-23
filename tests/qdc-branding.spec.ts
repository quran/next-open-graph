import { expect, test } from '@playwright/test';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const LOCALIZED_HOME_SHA256: Record<string, string> = {
  'og-ar.png': '6b13d57a91219b4dc45b1312ebf555e5011232c6b0ceee8f9d278019450b3868',
  'og-bn.png': '672e48a46a8f86276631c0735b225dad30068b845e71a449090904eac821b116',
  'og-en.png': '575800cb8443dacc9b9a58511026a375b82a54f3acfcfd571cf25b259df3c6dd',
  'og-es.png': '62cff0a23b15a89c37be9644b21ed06d2a1c219a84519fdb7202af7e082c6c1c',
  'og-fa.png': '84d3956f164b1ffdbd58a79ca07a154000c547b10a64e094f99443cf087cd4da',
  'og-fr.png': 'bfb4278cf59b2441004064e7586f886f7c47a73a084dc36e12578eb6671ec984',
  'og-id.png': '75b4d9ddadd2f8d3ac2f574d0c8c84a101a08c4a09fa62668084ee7e1f15422d',
  'og-ms.png': 'c38253e7c67c9c5c40203039e2f4c80695771bee696771ea9ca19f9c879067b4',
  'og-nl.png': '5edb04861efa2f12d55d376fa5fe4a942059bf28307eb5cfbd41baeed19fa006',
  'og-sw.png': 'cc5c9cbb1002fb02560d558c2f4f45935ef2e8b0b93580c14d2622fda54932a9',
  'og-tr.png': '2d95996b809d94df945a6d1afe1f627791c6aa84ae4830d0180a5da9eb53b7f6',
  'og-ur.png': '3ea10d2a85f086bdb574bd93a3249df09201b1c0997b23c67069f7689ebeae78',
  'og-vi.png': '1e46bfd526b82e0bdc17e62326d0a593b3fa25de3ccdb5643fc7f5896d2b65f5',
};

const PREMADE_SHA256: Record<string, string> = {
  ...LOCALIZED_HOME_SHA256,
  'og_about_en.png': '24b589d2af7fed3e65b1efccdd084fe007e3f679aca176cde3bba46e21174723',
  'og_beyond_ramadan.png': 'cd25495585ff06e0312099eb6148683ead201b6217b9eb7fd05a71a3c87c14b5',
  'og_calendar.png': 'd84fc5f5852eb2f5cf66960f33a33686e6e40144a997c1e24a5414faeeee9fe5',
  'og_daily.png': '42ecd4e65de9d6966db9395778ce1ccb93f48835b06404f64762450820d2118d',
  'og_embed.png': '41f337c61c42c2be1e7039c0d63131cf22a5b4d0ef7f31f9de32a2735f86706c',
  'og_explore_answers.png': '1ea2becdbe280f0c24dd42ae3738a131affe2bbdeb95bdc91e277338a5eb19f6',
  'og_learning_plans.png': 'a3f4a0e5877e640e60fd091534c55a32838cf4c3e5343a01da05998df2932283',
  'og_media.png': 'b95bbfefeb57369129a0e19ddf0825e1ca81bc5149da8bcabac63b2d5108fe5d',
  'og_preparing_for_ramadan.png': '5e27c8afc63614dfa9c2398f0d46d8e592daa58742213ef1211b49d89eaf1a58',
  'og_quran_reader_study_mode_hadith.png':
    '5610f1b52fa19a211ed1e0ad84f8e38dbf9b03175845e188b30a60fd9f951ec3',
  'og_quran_reader_study_mode_layers.png':
    'b27d3ded4809b7f40ea9c6a265471938e57ddf32bd9d378d37082c0f3f296396',
  'og_quran_reader_study_mode_lessons.png':
    '5b0a45fb0802e42c3152af4369a8d3b8bc55970d10324c9c53fcd43ddf06ec03',
  'og_quran_reader_study_mode_qiraat.png':
    'aef6ed82ba1b1118f853e181df73faf9eeab7f18ebb68a0818058730e902f9b5',
  'og_quran_reader_study_mode_reflections.png':
    '3e9dec23e65be6dde44a4f54aceade54f35ac23ecdcdb978ba59203aa4d6edf7',
  'og_quran_reader_study_mode_related_verses.png':
    '37b186d7f4c1b51325148463c2f900d48347558e9cb273fcd3efe7d9d8fadb65',
  'og_quran_reader_study_mode_tafsir.png':
    '972d14f2fa586ba773ac2b397fd73c2d83d8ca9603eaab037eef060ad4c67d0f',
  'og_ramadan2026.png': '57be846472a91d34465122b1d6772891179e8bc63637af89441263c233fee140',
  'og_ramadanchallenge.png': '18294847ad07fdb4cb1a9345f00310782cc9f1270e525f2d471d827ebb87bd17',
  'og_what_is_ramadan.png': '7970f79175824799df6648e8937717a8e5e8b8a4ebd212fd6e84b9954448413a',
};

const MAX_PREMADE_TOTAL_BYTES = 3_200_000;
const BRAND_SHA256: Record<string, string> = {
  'og-quran-com.png': '1122ecc03e3178b735a989a1f13ea48081b273abc015189fbb09096ebcd5e3ca',
  'og-quran-foundation.png': '8aa0e57ed9e7be99b7f88e7903e3a19e53f29b8620443364aa15a31167b392c2',
  'og-quran-reflect.png': '525d74fb549bde76cbc19cd45d6c3c30247f4e1e9a9f217f0a5ab71c2ae8c814',
};

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

test('homepage locales resolve to their approved localized images', () => {
  const routeSource = fs.readFileSync(
    path.join(process.cwd(), 'src/pages/api/og/index.tsx'),
    'utf8',
  );

  expect(routeSource).toContain('searchParams');
  Object.entries(LOCALIZED_HOME_SHA256).forEach(([fileName, expectedHash]) => {
    const image = fs.readFileSync(path.join(process.cwd(), 'public/premade', fileName));

    expect(image.readUInt32BE(16), `${fileName} width`).toBe(1366);
    expect(image.readUInt32BE(20), `${fileName} height`).toBe(768);
    expect(crypto.createHash('sha256').update(image).digest('hex'), fileName).toBe(expectedHash);
    expect(routeSource).toContain(fileName);
  });
});

test('brand defaults use their approved 1366 by 768 Open Graph images', () => {
  Object.entries(BRAND_SHA256).forEach(([fileName, expectedHash]) => {
    const image = fs.readFileSync(path.join(process.cwd(), 'public/premade', fileName));

    expect(image.readUInt32BE(16), `${fileName} width`).toBe(1366);
    expect(image.readUInt32BE(20), `${fileName} height`).toBe(768);
    expect(crypto.createHash('sha256').update(image).digest('hex'), fileName).toBe(expectedHash);
  });
});

test('premade Open Graph images stay within their existing payload budget', () => {
  const totalBytes = Object.keys(PREMADE_SHA256).reduce((total, fileName) => {
    return total + fs.statSync(path.join(process.cwd(), 'public/premade', fileName)).size;
  }, 0);

  expect(totalBytes).toBeLessThanOrEqual(MAX_PREMADE_TOTAL_BYTES);
});
