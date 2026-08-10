import { expect, test } from '@playwright/test';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const PREMADE_SHA256: Record<string, string> = {
  'og-ar.png': '09b0105374b97d0f546ad51b943809ac5376be8ea0e51c31e490e27dd6236f55',
  'og-bn.png': '4fd21d0680b51e90326247130c0fb988fcad08296cf54241e3050d46f7199bd0',
  'og-en.png': 'a77f1c652dcbb9349b2d9bc491c4c4a7cf2870ab9d2f834074fe8712a7044ffd',
  'og-es.png': 'ef98e3909ccb25e807e3e3087750d16410818784ebbe831f6c6516d43ed2ce8b',
  'og-fa.png': 'a8b79572b16661e9b8b40329a1a44dd4d3d4e7fd29a6128bd12ec92340a8f4ff',
  'og-fr.png': '41d20f20df79eadf8cee371dccdf83d38898ef1c4386e987561ab4f95dc01792',
  'og-id.png': 'c71783bf6f499f632584c3ab4a2679341963a261afeb359a499316c745fa7942',
  'og-ms.png': '57e10c140185ad9670948fe72303c998209b28bd3f2ab4975f2e84ce0283b388',
  'og-nl.png': '8c5dd412011bfe4f8a0c7f410fc58d6e7d33119fea55881f5c93aee7c55fa326',
  'og-sw.png': 'd84f1a258bb63de238fdc22f7bb82f698cbfe6eb1535cb2673331a880ac33528',
  'og-tr.png': 'a4801386ed021c033f0922b165cbe2ce3503ce8f1397d1e2ac1c44a366bd34cd',
  'og-ur.png': 'c5516589bd28e4d38fee85ae824438e8ad8510f1f71d45a7c9611088455c2a54',
  'og-vi.png': '2ed847194bd6c49ed3dfd161b08041274800f5a009510d87bab6fb4a33e00d01',
  'og_about_en.png': 'bfa3f04175658597167b1fb97be5969a971fa6d2cbd9352b631ec91080a3a28e',
  'og_beyond_ramadan.png': '366bc1a58bc9a537932c29b36503bbe3fff5f93e3bd2cc387e686f1bbcd1b60a',
  'og_calendar.png': 'a2e00745a803a0e33eef3129677fb432d8b7cc947cee20a003054f90af25e5f1',
  'og_daily.png': 'f1bc0c4029fc83303a37dd9350e515db5685df2c844a1191c23921899b1efd15',
  'og_embed.png': '56c6e631cb0ca14f58eb74e20c5bb57df0bd2d52c644a3a06f8be0e8d52e79ea',
  'og_explore_answers.png': 'b18e6167182ba1fc972eb1507f04813a864808175689c20f3b639f0c06b5b677',
  'og_learning_plans.png': '309ea8d2a3433b275bc1724cac3d0379d875b784c3e7bafa3ddb3ce2ab42eeac',
  'og_media.png': 'eff5b4c81572b8ea3b452d767f2bbed4c06132d4555525d11aa47099b282e2f4',
  'og_preparing_for_ramadan.png': '4ab4f1c5b5e4424240271922a38df754ee5b86a2a8f0ca7162028053bb426780',
  'og_quran_reader_study_mode_hadith.png':
    '200e7fbff995072d10d2382ea775fc9bfad9ef87ac52aebd5fce38e317ddc322',
  'og_quran_reader_study_mode_layers.png':
    '0e3ed807a26e04b9138f0d4aeb6a8a6ea07f83971a1661abf1073796ef14bd85',
  'og_quran_reader_study_mode_lessons.png':
    'f3cee0fdbba5a11104b1bed7756125cd7629198baeb9638d8b4d7e20ea11edd1',
  'og_quran_reader_study_mode_qiraat.png':
    '5b5731e11541e359c62f7b9a2c95b7254bcdfefcbeb63f35594dcf3d172aecd4',
  'og_quran_reader_study_mode_reflections.png':
    '35d74a4851011baf66d1d8634a265ee6af28f86469b071a88bbcc632be00a84c',
  'og_quran_reader_study_mode_related_verses.png':
    'a3a1edcae770b31eb497ede5d0a33e4d6c3492a86fac854efc06e90b21371b72',
  'og_quran_reader_study_mode_tafsir.png':
    'ce4ca40fc343c9cb042f12df8e5f6704363bc263132ba557bfcbd18b1f659bfa',
  'og_ramadan2026.png': '1013990a839fbbe586e02008ba028ed0171929d3e4e4f35cfa2df9f544d9aeb1',
  'og_ramadanchallenge.png': 'a5df96d7e8dc57e761d17915adcea9859fd7f73b540ad86ae398f562bf741e55',
  'og_what_is_ramadan.png': 'e0fd97ba376994d73af24d8244f148de9232e373db2d1e09dd17ac6b45abbd8f',
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
