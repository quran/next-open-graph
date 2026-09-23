import { expect, test } from '@playwright/test';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const APPROVED_OG_SHA256: Record<string, string> = {
  'og-ar.png': '6b13d57a91219b4dc45b1312ebf555e5011232c6b0ceee8f9d278019450b3868',
  'og-bn.png': '672e48a46a8f86276631c0735b225dad30068b845e71a449090904eac821b116',
  'og-en.png': '575800cb8443dacc9b9a58511026a375b82a54f3acfcfd571cf25b259df3c6dd',
  'og-es.png': '62cff0a23b15a89c37be9644b21ed06d2a1c219a84519fdb7202af7e082c6c1c',
  'og-fa.png': '84d3956f164b1ffdbd58a79ca07a154000c547b10a64e094f99443cf087cd4da',
  'og-fr.png': 'bfb4278cf59b2441004064e7586f886f7c47a73a084dc36e12578eb6671ec984',
  'og-id.png': '75b4d9ddadd2f8d3ac2f574d0c8c84a101a08c4a09fa62668084ee7e1f15422d',
  'og-ms.png': 'c38253e7c67c9c5c40203039e2f4c80695771bee696771ea9ca19f9c879067b4',
  'og-nl.png': '5edb04861efa2f12d55d376fa5fe4a942059bf28307eb5cfbd41baeed19fa006',
  'og-quran-com.png': '1122ecc03e3178b735a989a1f13ea48081b273abc015189fbb09096ebcd5e3ca',
  'og-quran-foundation.png': '8aa0e57ed9e7be99b7f88e7903e3a19e53f29b8620443364aa15a31167b392c2',
  'og-quran-reflect.png': '525d74fb549bde76cbc19cd45d6c3c30247f4e1e9a9f217f0a5ab71c2ae8c814',
  'og-sw.png': 'cc5c9cbb1002fb02560d558c2f4f45935ef2e8b0b93580c14d2622fda54932a9',
  'og-tr.png': '2d95996b809d94df945a6d1afe1f627791c6aa84ae4830d0180a5da9eb53b7f6',
  'og-ur.png': '3ea10d2a85f086bdb574bd93a3249df09201b1c0997b23c67069f7689ebeae78',
  'og-vi.png': '1e46bfd526b82e0bdc17e62326d0a593b3fa25de3ccdb5643fc7f5896d2b65f5',
  'og_daily.png': '42ecd4e65de9d6966db9395778ce1ccb93f48835b06404f64762450820d2118d',
  'og_explore_answers.png': '1ea2becdbe280f0c24dd42ae3738a131affe2bbdeb95bdc91e277338a5eb19f6',
  'og_learning_plans.png': 'a3f4a0e5877e640e60fd091534c55a32838cf4c3e5343a01da05998df2932283',
  'og_media.png': 'b95bbfefeb57369129a0e19ddf0825e1ca81bc5149da8bcabac63b2d5108fe5d',
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
};

test('approved Open Graph assets retain their source dimensions and contents', () => {
  Object.entries(APPROVED_OG_SHA256).forEach(([fileName, expectedHash]) => {
    const image = fs.readFileSync(path.join(process.cwd(), 'public/premade', fileName));

    expect(image.readUInt32BE(16), `${fileName} width`).toBe(1366);
    expect(image.readUInt32BE(20), `${fileName} height`).toBe(768);
    expect(crypto.createHash('sha256').update(image).digest('hex'), fileName).toBe(expectedHash);
  });
});
