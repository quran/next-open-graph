import { NextRequest } from "next/server";
import type { PageConfig } from "next/types";

export const config: PageConfig = {
    runtime: "edge",
};

const LANG_TO_FILE: Record<string, string> = {
    ar: "og-ar.png",
    bn: "og-bn.png",
    en: "og-en.png",
    es: "og-es.png",
    fa: "og-fa.png",
    fr: "og-fr.png",
    id: "og-id.png",
    ms: "og-ms.png",
    nl: "og-nl.png",
    sw: "og-sw.png",
    tr: "og-tr.png",
    ur: "og-ur.png",
    vi: "og-vi.png",
};

export default async function handler(req: NextRequest) {
    const lang = req.nextUrl.searchParams.get("lang")?.toLowerCase() || "en";
    const file = LANG_TO_FILE[lang] || LANG_TO_FILE.en;

    const assetUrl = new URL(`/premade/${file}`, req.url);
    return fetch(assetUrl);
}
