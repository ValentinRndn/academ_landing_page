# Academ — landing page

Static marketing site for [academ.my](https://academ.my). Authenticated app
lives in a separate repository (Nuxt) and is deployed at `app.academ.my`.

Stack: [Astro 6](https://astro.build/) + Tailwind CSS 4 + custom design tokens.
Deployment: Coolify (Dockerfile included), or any static host (Cloudflare
Pages, Netlify, Vercel...).

## Run

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # output in dist/
npm run preview  # serve dist/
```

## Layout

```
src/
├── i18n/                 # 8 locales (en default, fr, de, es, it, nl, sv, ar RTL)
│   ├── index.ts          # useTranslations(locale), localizedPath(locale, path)
│   └── *.json
├── assets/images/        # logo + favicon
├── styles/global.css     # design tokens + glass utilities + dark mode
├── layouts/Layout.astro  # SEO + OG + dark-mode boot script (anti-FOUC)
├── components/
│   ├── Header.astro
│   ├── Footer.astro
│   ├── DarkModeToggle.astro
│   └── sections/         # Hero / Features / HowItWorks / Testimonials / FAQ / CTA
└── pages/
    ├── index.astro          # /        (en, default locale)
    ├── [lang]/index.astro   # /fr/ /de/ /es/ /it/ /nl/ /sv/ /ar/
    ├── confidentialite.astro
    └── mentions-legales.astro
```

## Adding/updating translations

Translation strings live in `src/i18n/<locale>.json`. They were imported from
the Academ Nuxt project's `i18n/locales/` so the wording stays consistent
between the marketing site and the app. When you tweak landing copy in the
app, re-run `scripts/extract-translations.mjs` to sync.

Missing keys in a non-default locale fall back to English at runtime — see
`src/i18n/index.ts`.

## Theming

The dark-mode toggle uses the same `localStorage` key (`darkMode`) as the
Academ Nuxt app so the preference can carry over if both apps share a parent
domain. `html.dark` is applied synchronously in `<head>` to avoid a flash of
light theme.

Glass utilities (`btn-glass-primary`, `badge-glass-primary`, `glass`...) live
in `src/styles/global.css` and were ported 1:1 from the Academ Nuxt design
system — keep them in sync if you tweak the source.
