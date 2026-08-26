import type { PageConfig } from "next/types";
import { fetchWithEdgeSentry, getEdgeBaseUrl } from '@/lib/edge';

export const config: PageConfig = {
    runtime: "edge",
};

export default async function handler() {
    const assetUrl = new URL('/premade/og-quran-com.png', getEdgeBaseUrl());
    return fetchWithEdgeSentry(assetUrl, {
        route: "/api/og",
        file: 'og-quran-com.png',
        asset_url: assetUrl.toString(),
    });
}
