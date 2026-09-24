import { expect, test } from '@playwright/test';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const APPROVED_OG_SHA256: Record<string, string> = {
  'og-ar.png': '3b25654966d43b2bd4e5986a3ab77281064dc04f391c65d371b9fcede996d25e',
  'og-bn.png': 'a8d4ab7bad7481c1035e86d20036c63657a2116000af953014168ac956518a3e',
  'og-en.png': '65fff042983e44102d4b739c9ef4402370853fbe248dae14a6b0be7673e7e106',
  'og-es.png': '00712bfccec5c7510e239dfb8989b0eb33b1434e7dfb7bad6f6715bd30823b14',
  'og-fa.png': 'be2d05430cdde9ad08f425e5f6b8a6777c4602599c81ef6567c4168220ff2270',
  'og-fr.png': 'cbb3007d598e3502f84c8b74a8acece708e1256710daeb8089f6dd0f5d5723c9',
  'og-id.png': 'd0cc81d34439f082d97f403ae6fdf8a4eb6fe452274b68f92d021fa1c39759a0',
  'og-ms.png': '5fb9d7bfb9e3dcb2fea3ec457941e1231e71dd3372a632d6cbc77f66f89ad47c',
  'og-nl.png': '9f6a8ffd1796de033ae620dd7e5ecbd1e65f3adce0e03bacbf1fbae73c627e68',
  'og-quran-com.png': 'b8f41856bf937e310b9bc4ab9b99879a989aede9f02b6a4f1a21f5b96d28ca37',
  'og-quran-foundation.png': '177cd472cdce941ceef07112b04372a92bcfbd456a95309129268d7cdd3a3a45',
  'og-quran-reflect.png': '367d5fa72615f12c09ef48af6e4834f98012f9d5206effcd7644a8ec61a98fab',
  'og-sw.png': 'f8d02c367dfd11396c7d039820578c1a895cb8370563142a040ed1e5ac7f5fbe',
  'og-tr.png': 'df959f79e7eb943d623314148ff41e88909f5d95ac3395ead7efef53c243b25a',
  'og-ur.png': 'dd8a75766c6ecc950c23cc11124726b14871195d3394e2ad0addc11ef792c7fd',
  'og-vi.png': '9730d97d6487ff60d944b6d2bc557703013ae57eb0fe6b399702c72d7a037115',
  'og_daily.png': '245a145ba80fa13077674d4565672a918ff7792aa7e25b9c32850b7de5ff113f',
  'og_explore_answers.png': '115c6c5847d976bc1272661df8443c0b9d25f42631e62f5e8019b6f047b42a80',
  'og_learning_plans.png': '4f119d4479ec52c2379a8fc82b62a035879d3368b243614c711f9d157272d99d',
  'og_media.png': 'da7127e67e9f1059611a69de8b9de1d5023f674ccb484a8012b811668585575b',
  'og_quran_reader_study_mode_hadith.png':
    '9bec61c3107305c86953828081e6389c78918850dd1f08646df902398f355798',
  'og_quran_reader_study_mode_layers.png':
    '350cfc92efdf035e02859d5d75cc5310436ed1a2b9f498614efd0b2cc2f02f44',
  'og_quran_reader_study_mode_lessons.png':
    '237d2798c65e4e672f18c54289b037005ce71d266ee566f62ef6256e1ec17ef4',
  'og_quran_reader_study_mode_qiraat.png':
    'f1f9e880de60f4c46a7f6ad36676bfd15c737c28c0f1858aa34df957bea34f4f',
  'og_quran_reader_study_mode_reflections.png':
    'af90c5c52118587ced231a95c02caa84deaebd41457abd8af2b24c3fc063679f',
  'og_quran_reader_study_mode_related_verses.png':
    'fadbe14202b9befe6e36afa5e40cdbc83e2c73356991d299a23affcfd95cb047',
  'og_quran_reader_study_mode_tafsir.png':
    '36b128db486ef24853137510494cf2192a1cdb89560155090e287445d003a324',
};

test('approved Open Graph assets retain their source dimensions and contents', () => {
  Object.entries(APPROVED_OG_SHA256).forEach(([fileName, expectedHash]) => {
    const image = fs.readFileSync(path.join(process.cwd(), 'public/premade', fileName));

    expect(image.readUInt32BE(16), `${fileName} width`).toBe(1200);
    expect(image.readUInt32BE(20), `${fileName} height`).toBe(630);
    expect(crypto.createHash('sha256').update(image).digest('hex'), fileName).toBe(expectedHash);
  });
});
