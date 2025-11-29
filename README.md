# Quran.com Open Graph Image Generator

## Tech Stack

- [Next.js](https://nextjs.org/)
- [Satori](https://github.com/vercel/satori)

## How to use

1. Main Image

![Quran.com](https://og.qurancdn.com/api/og)

`https://og.qurancdn.com/api/og`

Optional query parameters:

- `lang` - Image locale. Defaults to `en`.

---

2. Chapter Image

![Quran.com](https://og.qurancdn.com/api/og/chapter/1)

`https://og.qurancdn.com/api/og/chapter/[chapterId]`

Required parameters:

- `[chapterId]` - Chapter number from 1-114.

Optional query parameters:

- `lang` - Image locale. Defaults to `en`.
- `verse` - Verse number.

---

3. About the Quran Image

![Quran.com](https://og.qurancdn.com/api/og/about-the-quran)

`https://og.qurancdn.com/api/og/about-the-quran`

---

4. Learning Plans Image

![Quran.com](https://og.qurancdn.com/api/og/learning-plans)

`https://og.qurancdn.com/api/og/learning-plans`
---

5. Media Generator Image

![Quran.com](https://og.qurancdn.com/api/og/media)

`https://og.qurancdn.com/api/og/media`
---
6. Preparing for Ramadan

![Quran.com](https://og.qurancdn.com/api/og/preparing-for-ramadan)

`https://og.qurancdn.com/api/og/preparing-for-ramadan`
---
7. What Is Ramadan Image

![Quran.com](https://og.qurancdn.com/api/og/what-is-ramadan)

`https://og.qurancdn.com/api/og/what-is-ramadan`
---
8. Explore Answers

![Quran.com](https://og.qurancdn.com/api/og/explore-answers)

`https://og.qurancdn.com/api/og/explore-answers`
---
9. Calendar

![Quran.com](https://og.qurancdn.com/api/og/calendar)

`https://og.qurancdn.com/api/og/calendar`
---
10. Beyond Ramadan

![Quran.com](https://og.qurancdn.com/api/og/beyond-ramadan)

`https://og.qurancdn.com/api/og/beyond-ramadan`

Optional query parameters:

- `lang` - Image locale. Defaults to `en`.

---

## Testing

This project uses [Playwright](https://playwright.dev/) for automated testing, including visual regression tests for OG images.

### Prerequisites

```bash
# Use Node.js 24
nvm use 24

# Install dependencies
yarn install

# Install Playwright browsers
npx playwright install chromium
```

### Running Tests

```bash
# Run all tests (starts dev server automatically)
yarn test

# Run tests in interactive UI mode
yarn test:ui

# Update visual regression snapshots
yarn test:update-snapshots
```

### Testing Against Production

```bash
BASE_URL=https://og.qurancdn.com yarn test
```

### Test Coverage

- **OG Image Generation**: Validates that all endpoints return valid PNG images
- **Visual Regression**: Compares generated images against baseline snapshots for all 12 supported languages (ar, bn, en, es, fa, fr, id, ms, nl, sw, tr, ur)
