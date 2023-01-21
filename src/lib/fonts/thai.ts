import { loadFileOnEdge } from '../edge';

const THAI_URLS = {
  300: '/fonts/thai/Kanit-Light.ttf',
  400: '/fonts/thai/Kanit-Regular.ttf',
  600: '/fonts/thai/Kanit-SemiBold.ttf',
};

const thai = async (weights: Array<keyof typeof THAI_URLS>) => {
  const urls = weights.map(w => THAI_URLS[w]);

  const responses = await Promise.all(urls.map(url => loadFileOnEdge(url)));

  // @ts-ignore
  const result: Record<Weight, ArrayBuffer> = {};

  weights.forEach((weight, i) => {
    result[weight] = responses[i];
  });

  return result;
};

export default thai;
