import { test, expect } from "@playwright/test";

// All supported languages
const LANGUAGES = [
  "ar",
  "bn",
  "en",
  "es",
  "fa",
  "fr",
  "id",
  "ms",
  "nl",
  "sw",
  "tr",
  "ur",
];

// All static OG pages (endpoints without dynamic parameters)
const STATIC_PAGES = [
  "/api/og/about-the-quran",
  "/api/og/beyond-ramadan",
  "/api/og/calendar",
  "/api/og/explore-answers",
  "/api/og/learning-plans",
  "/api/og/media",
  "/api/og/preparing-for-ramadan",
  "/api/og/what-is-ramadan",
];

// Sample chapters (first, middle, last, popular ones)
const SAMPLE_CHAPTERS = [1, 2, 18, 36, 55, 67, 78, 114];

// PNG signature: first 8 bytes
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function isPng(buffer: Buffer): boolean {
  // @ts-ignore
  return buffer.subarray(0, 8).equals(PNG_SIGNATURE);
}

// ============================================================================
// MAIN OG ENDPOINT: /api/og
// ============================================================================
test.describe("Main OG Endpoint (/api/og)", () => {
  test("should return valid PNG for default (no params)", async ({
    request,
  }) => {
    const response = await request.get("/api/og");
    expect(response.status()).toBe(200);

    const body = await response.body();
    expect(isPng(body), "Response should be a valid PNG").toBe(true);
    expect(body.length).toBeGreaterThan(1000);
  });

  for (const lang of LANGUAGES) {
    test(`should return valid PNG for lang=${lang}`, async ({ request }) => {
      const response = await request.get(`/api/og?lang=${lang}`);
      expect(response.status()).toBe(200);

      const body = await response.body();
      expect(isPng(body), `Not a valid PNG for lang=${lang}`).toBe(true);
      expect(body.length).toBeGreaterThan(1000);
    });
  }

  test("should handle invalid language with fallback (returns 200)", async ({
    request,
  }) => {
    const response = await request.get("/api/og?lang=invalid");
    expect(response.status()).toBe(200);

    const body = await response.body();
    expect(isPng(body)).toBe(true);
  });
});

// ============================================================================
// CHAPTER ENDPOINT: /api/og/chapter/[id]
// ============================================================================
test.describe("Chapter OG Endpoint (/api/og/chapter/[id])", () => {
  // Test sample chapters
  for (const id of SAMPLE_CHAPTERS) {
    test(`should return valid PNG for chapter ${id}`, async ({ request }) => {
      const response = await request.get(`/api/og/chapter/${id}`);
      expect(response.status()).toBe(200);

      const body = await response.body();
      expect(isPng(body), `Not a valid PNG for chapter ${id}`).toBe(true);
      expect(body.length).toBeGreaterThan(1000);
    });
  }

  // Test ALL 114 chapters
  for (let id = 1; id <= 114; id++) {
    test(`chapter ${id} returns valid PNG`, async ({ request }) => {
      const response = await request.get(`/api/og/chapter/${id}?lang=en`);
      expect(response.status(), `Failed for chapter ${id}`).toBe(200);

      const body = await response.body();
      expect(isPng(body), `Not a valid PNG for chapter ${id}`).toBe(true);
    });
  }

  // Test chapters with different languages
  test.describe("Chapter with languages", () => {
    for (const lang of LANGUAGES) {
      test(`chapter 1 with lang=${lang}`, async ({ request }) => {
        const response = await request.get(`/api/og/chapter/1?lang=${lang}`);
        expect(response.status()).toBe(200);

        const body = await response.body();
        expect(isPng(body)).toBe(true);
      });
    }
  });

  // Test chapter with verse parameter
  test.describe("Chapter with verse parameter", () => {
    const verseTests = [
      { chapter: 1, verse: 1 },
      { chapter: 1, verse: 7 },
      { chapter: 2, verse: 255 }, // Ayatul Kursi
      { chapter: 36, verse: 1 },
      { chapter: 114, verse: 1 },
    ];

    for (const { chapter, verse } of verseTests) {
      test(`chapter ${chapter} verse ${verse}`, async ({ request }) => {
        const response = await request.get(
          `/api/og/chapter/${chapter}?verse=${verse}`
        );
        expect(response.status()).toBe(200);

        const body = await response.body();
        expect(isPng(body)).toBe(true);
      });
    }
  });

  // Edge cases - deterministic expectations based on actual API behavior
  test("should return 400 for chapter 0 (invalid)", async ({ request }) => {
    const response = await request.get("/api/og/chapter/0");
    expect(response.status()).toBe(400);
  });

  test("should return 400 for chapter 115 (invalid)", async ({ request }) => {
    const response = await request.get("/api/og/chapter/115");
    expect(response.status()).toBe(400);
  });

  test("should return 400 for non-numeric chapter", async ({ request }) => {
    const response = await request.get("/api/og/chapter/abc");
    expect(response.status()).toBe(400);
  });
});

// ============================================================================
// STATIC PAGE ENDPOINTS
// ============================================================================
test.describe("Static Page OG Endpoints", () => {
  for (const page of STATIC_PAGES) {
    const pageName = page.split("/").pop();

    test(`${pageName} returns valid PNG`, async ({ request }) => {
      const response = await request.get(page);
      expect(response.status(), `Failed for ${page}`).toBe(200);

      const body = await response.body();
      expect(isPng(body), `Not a valid PNG for ${page}`).toBe(true);
      expect(body.length).toBeGreaterThan(1000);
    });
  }

  // Test static pages with language parameter (if supported)
  test.describe("Static pages with language parameter", () => {
    for (const page of STATIC_PAGES) {
      const pageName = page.split("/").pop();

      test(`${pageName} with lang=ar`, async ({ request }) => {
        const response = await request.get(`${page}?lang=ar`);
        // Some static pages may not support lang param, so 200 is expected
        expect(response.status()).toBe(200);

        const body = await response.body();
        expect(isPng(body)).toBe(true);
      });
    }
  });
});

// ============================================================================
// ABOUT THE QURAN ENDPOINT
// ============================================================================
test.describe("About The Quran (/api/og/about-the-quran)", () => {
  test("returns valid PNG", async ({ request }) => {
    const response = await request.get("/api/og/about-the-quran");
    expect(response.status()).toBe(200);

    const body = await response.body();
    expect(isPng(body)).toBe(true);
  });
});

// ============================================================================
// BEYOND RAMADAN ENDPOINT
// ============================================================================
test.describe("Beyond Ramadan (/api/og/beyond-ramadan)", () => {
  test("returns valid PNG", async ({ request }) => {
    const response = await request.get("/api/og/beyond-ramadan");
    expect(response.status()).toBe(200);

    const body = await response.body();
    expect(isPng(body)).toBe(true);
  });

  for (const lang of LANGUAGES) {
    test(`with lang=${lang}`, async ({ request }) => {
      const response = await request.get(`/api/og/beyond-ramadan?lang=${lang}`);
      expect(response.status()).toBe(200);

      const body = await response.body();
      expect(isPng(body)).toBe(true);
    });
  }
});

// ============================================================================
// CALENDAR ENDPOINT
// ============================================================================
test.describe("Calendar (/api/og/calendar)", () => {
  test("returns valid PNG", async ({ request }) => {
    const response = await request.get("/api/og/calendar");
    expect(response.status()).toBe(200);

    const body = await response.body();
    expect(isPng(body)).toBe(true);
  });
});

// ============================================================================
// EXPLORE ANSWERS ENDPOINT
// ============================================================================
test.describe("Explore Answers (/api/og/explore-answers)", () => {
  test("returns valid PNG", async ({ request }) => {
    const response = await request.get("/api/og/explore-answers");
    expect(response.status()).toBe(200);

    const body = await response.body();
    expect(isPng(body)).toBe(true);
  });
});

// ============================================================================
// LEARNING PLANS ENDPOINT
// ============================================================================
test.describe("Learning Plans (/api/og/learning-plans)", () => {
  test("returns valid PNG", async ({ request }) => {
    const response = await request.get("/api/og/learning-plans");
    expect(response.status()).toBe(200);

    const body = await response.body();
    expect(isPng(body)).toBe(true);
  });
});

// ============================================================================
// MEDIA ENDPOINT
// ============================================================================
test.describe("Media (/api/og/media)", () => {
  test("returns valid PNG", async ({ request }) => {
    const response = await request.get("/api/og/media");
    expect(response.status()).toBe(200);

    const body = await response.body();
    expect(isPng(body)).toBe(true);
  });
});

// ============================================================================
// PREPARING FOR RAMADAN ENDPOINT
// ============================================================================
test.describe("Preparing for Ramadan (/api/og/preparing-for-ramadan)", () => {
  test("returns valid PNG", async ({ request }) => {
    const response = await request.get("/api/og/preparing-for-ramadan");
    expect(response.status()).toBe(200);

    const body = await response.body();
    expect(isPng(body)).toBe(true);
  });
});

// ============================================================================
// WHAT IS RAMADAN ENDPOINT
// ============================================================================
test.describe("What is Ramadan (/api/og/what-is-ramadan)", () => {
  test("returns valid PNG", async ({ request }) => {
    const response = await request.get("/api/og/what-is-ramadan");
    expect(response.status()).toBe(200);

    const body = await response.body();
    expect(isPng(body)).toBe(true);
  });
});

// ============================================================================
// VISUAL REGRESSION TESTS
// ============================================================================
test.describe("Visual Regression - Main OG", () => {
  for (const lang of LANGUAGES) {
    test(`main OG lang=${lang} matches snapshot`, async ({ request }) => {
      const response = await request.get(`/api/og?lang=${lang}`);
      const imageBuffer = await response.body();

      expect(imageBuffer).toMatchSnapshot(`og-${lang}.png`);
    });
  }
});

test.describe("Visual Regression - Chapters", () => {
  // Snapshot tests for key chapters
  const snapshotChapters = [1, 2, 36, 67, 114];

  for (const id of snapshotChapters) {
    test(`chapter ${id} matches snapshot`, async ({ request }) => {
      const response = await request.get(`/api/og/chapter/${id}?lang=en`);
      const imageBuffer = await response.body();

      expect(imageBuffer).toMatchSnapshot(`og-chapter-${id}-en.png`);
    });
  }
});

test.describe("Visual Regression - Static Pages", () => {
  for (const page of STATIC_PAGES) {
    const pageName = page.split("/").pop();

    test(`${pageName} matches snapshot`, async ({ request }) => {
      const response = await request.get(page);
      const imageBuffer = await response.body();

      expect(imageBuffer).toMatchSnapshot(`og-${pageName}.png`);
    });
  }
});

// ============================================================================
// RESPONSE HEADERS & PERFORMANCE
// ============================================================================
test.describe("Response Quality", () => {
  test("main OG has reasonable response time", async ({ request }) => {
    const start = Date.now();
    const response = await request.get("/api/og");
    const duration = Date.now() - start;

    expect(response.status()).toBe(200);
    // Should respond within 10 seconds (generous for cold start)
    expect(duration).toBeLessThan(10000);
  });

  test("images have reasonable size", async ({ request }) => {
    const response = await request.get("/api/og");
    const body = await response.body();

    // Image should be between 10KB and 500KB
    expect(body.length).toBeGreaterThan(10 * 1024);
    expect(body.length).toBeLessThan(500 * 1024);
  });
});

// ============================================================================
// EDGE CASES & ERROR HANDLING
// ============================================================================
test.describe("Edge Cases", () => {
  test("handles empty query string", async ({ request }) => {
    const response = await request.get("/api/og?");
    expect(response.status()).toBe(200);

    const body = await response.body();
    expect(isPng(body)).toBe(true);
  });

  test("handles unknown query parameters gracefully", async ({ request }) => {
    const response = await request.get("/api/og?unknown=value&foo=bar");
    expect(response.status()).toBe(200);

    const body = await response.body();
    expect(isPng(body)).toBe(true);
  });

  test("handles uppercase language (EN) - returns valid PNG", async ({
    request,
  }) => {
    const response = await request.get("/api/og?lang=EN");
    expect(response.status()).toBe(200);

    const body = await response.body();
    expect(isPng(body)).toBe(true);
  });

  test("invalid language returns 200 with fallback image", async ({
    request,
  }) => {
    const response = await request.get("/api/og?lang=invalid");
    expect(response.status()).toBe(200);

    const body = await response.body();
    expect(isPng(body)).toBe(true);
  });

  test("chapter 0 (invalid) returns 400", async ({ request }) => {
    const response = await request.get("/api/og/chapter/0");
    expect(response.status()).toBe(400);
  });

  test("chapter 115 (invalid) returns 400", async ({ request }) => {
    const response = await request.get("/api/og/chapter/115");
    expect(response.status()).toBe(400);
  });

  test("non-numeric chapter returns 400", async ({ request }) => {
    const response = await request.get("/api/og/chapter/abc");
    expect(response.status()).toBe(400);
  });

  test("very large verse number returns 400", async ({ request }) => {
    const response = await request.get("/api/og/chapter/2?verse=9999");
    expect(response.status()).toBe(400);
  });

  test("negative chapter number returns 400", async ({ request }) => {
    const response = await request.get("/api/og/chapter/-1");
    expect(response.status()).toBe(400);
  });

  test("decimal chapter number returns 500", async ({ request }) => {
    const response = await request.get("/api/og/chapter/1.5");
    expect(response.status()).toBe(500);
  });
});
