import { loadFileOnEdge } from '../edge';

const MONTSERRAT_URLS = {
  300: '/fonts/Montserrat/Montserrat-Light.ttf',
  500: '/fonts/Montserrat/Montserrat-Medium.ttf',
  700: '/fonts/Montserrat/Montserrat-Bold.ttf',
};

const montserrat = async (weights: Array<keyof typeof MONTSERRAT_URLS>) => {
  const urls = weights.map(w => MONTSERRAT_URLS[w]);

  const responses = await Promise.all(urls.map(url => loadFileOnEdge(url)));

  // @ts-ignore
  const result: Record<Weight, ArrayBuffer> = {};

  weights.forEach((weight, i) => {
    result[weight] = responses[i];
  });

  return result;
};

export default montserrat;
