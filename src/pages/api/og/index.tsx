import type { PageConfig } from "next/types";
import { getEdgeBaseUrl } from '@/lib/edge';

export const config: PageConfig = {
    runtime: "edge",
};

export default async function handler() {
    const assetUrl = new URL('/premade/og-quran-com.png', getEdgeBaseUrl());
    return fetch(assetUrl);
}
