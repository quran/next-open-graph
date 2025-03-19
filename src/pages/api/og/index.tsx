import type { PageConfig } from 'next/types';

export const config: PageConfig = {
  runtime: 'edge',
};

export default async function handler() {
  return fetch(new URL('/public/premade/og-en.png', import.meta.url),);
}
