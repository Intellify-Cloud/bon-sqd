# SEO Implementation Guide — Bond Squad

> **Audience:** Developers working on the Bond Squad Jekyll site  
> **Production URL:** `https://evohomeloans.co.za`  
> **Principle:** Improve crawlability, metadata, content quality, and measurement without inventing business facts or public URLs.

## Current implementation

| Area | Status | Notes |
|---|---|---|
| Canonical URLs | Implemented | Uses `page.url` and `absolute_url` in `_includes/head.html` |
| Meta descriptions | Partial | Falls back to one site-wide description |
| Page titles | Partial | Page titles exist, but the appended site title is too long |
| Open Graph/Twitter | Partial | Descriptions vary, but social titles are duplicated |
| Semantic landmarks | Implemented | Global `nav`, `main`, `header`, and `footer` exist |
| Homepage H1 | Implemented | Rendered by `_includes/hero.html` |
| Other page H1s | Missing | The `page` layout does not render `page.title` as an H1 |
| Image alternatives | Partial | Main team/client images are covered; unused portfolio templates still need work |
| XML sitemap | Missing | Prefer `jekyll-sitemap` |
| Structured data | Missing | Business facts must be verified before implementation |
| Analytics | Invalid placeholder | `G-XXX` is truthy and currently triggers an invalid analytics request |
| Visual QA | Implemented | `npm.cmd run test:visual` covers primary routes and viewports |

## Important constraints

- Do not create URLs for home-page sections such as `/about.html`, `/services.html`, or `/team.html`. They are not standalone pages.
- Do not add `SearchAction`. The site has no internal search endpoint, and Google retired the sitelinks search box in November 2024.
- Do not publish unverified street addresses, business categories, telephone numbers, opening hours, or service areas in structured data.
- Do not use `robots.txt` to prevent indexing. Use `noindex`, authentication, or removal for that purpose.
- Do not fabricate sitemap `lastmod` values. Omit `lastmod` when no reliable content-modified date exists.

---

## Priority 1 — Indexing and metadata

### 1. Add an XML sitemap

Use the maintained Jekyll plugin rather than a hardcoded list.

```ruby
# Gemfile
group :jekyll_plugins do
  gem "jekyll-sitemap"
end
```

```yaml
# _config.yml
plugins:
  - jekyll-sitemap
```

Implementation checklist:

- Run `bundle install` and commit `Gemfile.lock`.
- Build and confirm `_site/sitemap.xml` exists.
- Confirm every `<loc>` matches the page's canonical URL.
- Exclude 404, draft, test, and intentionally non-indexable pages.
- Submit the production sitemap in Google Search Console.

A sitemap helps discovery but does not guarantee crawling or indexing.

### 2. Add a minimal robots.txt

Only deployed URLs can be crawled. Local source directories such as `node_modules`
do not require robots rules when Jekyll does not publish them.

```text
User-agent: *
Allow: /

Sitemap: https://evohomeloans.co.za/sitemap.xml
```

Do not block `404.html` if it carries a `noindex` directive: crawlers must access a
page to read its meta robots directive.

### 3. Shorten and centralize title generation

The current `site.title` is already a complete marketing title. Appending it to
every page produces long, repetitive titles. Add a short brand name:

```yaml
# _config.yml
brand_name: Bond Squad
```

```liquid
{% capture seo_title %}
  {% if page.seo_title %}
    {{ page.seo_title }}
  {% elsif page.title %}
    {{ page.title }} | {{ site.brand_name }}
  {% else %}
    {{ site.title }}
  {% endif %}
{% endcapture %}
<title>{{ seo_title | strip }}</title>
```

Titles should be unique, descriptive, and concise. Treat approximately 50–60
characters as a display heuristic, not a Google requirement.

Recommended page metadata:

| Source file | Suggested `seo_title` |
|---|---|
| `index.md` | `Bond Origination & Home Loan Experts in CT & KZN` |
| `contact.md` | `Contact Our Home Loan Experts` |
| `affordability-calculator.md` | `Bond Affordability Calculator` |
| `bond-calculator.md` | `Bond Repayment Calculator` |
| `transfer-cost-calculator.md` | `Property Transfer Cost Calculator` |
| `amortisation-calculator.md` | `Home Loan Amortisation Calculator` |
| `deposit-savings-calculator.md` | `Home Deposit Savings Calculator` |
| `additional-payment-calculator.md` | `Additional Bond Payment Calculator` |
| `privacy-statement.md` | `Privacy Statement` |
| `data-sharing-agreement.md` | `Data Sharing Agreement` |

Also correct the duplicated `Extra Repayment Calculator` title currently used by
`amortisation-calculator.md`.

### 4. Add unique page descriptions

Keep the site-wide description as a fallback, but give every public page a useful
front-matter description.

```yaml
description: Calculate your estimated monthly home loan repayments with Bond Squad's free bond repayment calculator.
```

Descriptions should accurately summarize the page and encourage a relevant click.
Approximately 120–160 characters is a useful writing target, not a strict rule.

### 5. Make social metadata page-specific

`og:title` and `twitter:title` currently use `site.title` for every page. Reuse the
computed SEO title and allow page-specific social images:

```liquid
<meta property="og:title" content="{{ seo_title | strip | escape }}">
<meta property="og:description" content="{{ page.description | default: site.description | escape }}">
<meta property="og:image" content="{{ page.image | default: '/social_916x509.jpg' | absolute_url }}">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{ seo_title | strip | escape }}">
<meta name="twitter:description" content="{{ page.description | default: site.description | escape }}">
<meta name="twitter:image" content="{{ page.image | default: '/social_916x509.jpg' | absolute_url }}">
```

Use `name="twitter:*"` for Twitter/X metadata and escape user-editable values.

---

## Priority 2 — Page structure and content

### 6. Add H1 output to ordinary pages

The homepage already has an H1 in the hero. Other pages need a visible page heading.
Render it in `_layouts/page.html` unless the page explicitly opts out:

```liquid
{% unless page.hide_title %}
  <h1 class="page-title">{{ page.title }}</h1>
{% endunless %}
```

Then change subordinate headings to maintain a logical hierarchy. For example,
contact regions should be H2 elements beneath the page H1.

Aim for one clear page-level H1 for accessibility and document structure; do not add
a second hidden H1 to the homepage.

### 7. Improve calculator page content and linking

Calculator pages currently contain little content beyond third-party iframes. Add:

- A short, unique explanation of what the calculator estimates.
- A note that results are estimates rather than financial advice.
- Two or more relevant calculator links.
- A clear contact link for professional assistance.

Prefer a reusable related-calculators include driven by `_data` rather than copying
the same Markdown list into every page.

### 8. Correct duplicate and inconsistent page metadata

Known issues:

- `amortisation-calculator.md` uses the Extra Repayment title.
- `legal.md` and `privacy-statement.md` both use `Privacy Policy`.
- `contact.md` uses the vague title `Bond Squad`.
- Several public pages have no `description`.

### 9. Audit encoding

The site data and some legal content contain mojibake such as `â€™`, `â€”`, and
`â€œ`. Save source files as UTF-8 and replace corrupted punctuation with the intended
Unicode characters. Encoding errors are visible quality defects and may reach title,
description, and structured-data output.

---

## Priority 3 — Structured data and local SEO

### 10. Verify business facts first

Before generating JSON-LD, confirm with the business owner:

- Legal/public business name.
- Appropriate Schema.org type.
- Whether each location is a customer-facing location or only a service area.
- Complete publishable postal addresses.
- Primary public telephone number and email address.
- Opening hours.
- Authoritative social profiles.

Do not infer these facts from partial display text.

### 11. Implement organization/location schema from data

Once verified, store business facts in `_data/business.yml` and render JSON-LD from
one include. If Durban and Cape Town are distinct public locations, model them as
separate location entities linked to the parent organization rather than placing an
array of partial addresses on one generic LocalBusiness object.

Minimum organization properties:

- `@context`
- `@type`
- stable `@id`
- `name`
- `url`
- `logo`
- verified `sameAs`

Only add telephone, address, area served, opening hours, and price information when
accurate and publicly supported. Do not add `SearchAction`.

### 12. Breadcrumbs

Breadcrumb structured data should represent a real page hierarchy. Calculator pages
can use `Home > Calculators > Current Calculator`, but ideally the visible interface
should expose the same hierarchy. Build breadcrumb URLs with `absolute_url`; never
hardcode a second domain copy.

---

## Priority 4 — Images and performance

### 13. Add intrinsic image dimensions

Add correct `width` and `height` attributes using each asset's real dimensions.
Do not force every bank logo into an invented `150 × 80` ratio.

- Keep meaningful alt text on team and client images.
- Use `alt=""` for decorative images.
- Lazy-load below-the-fold images.
- Do not lazy-load the LCP image.
- Preserve aspect ratio with CSS.

### 14. Audit the hero/LCP image

The hero is a CSS background. Measure LCP before adding a preload because unnecessary
preloads compete with more important resources. If measurement confirms the hero is
the LCP asset, preload the exact generated production URL or consider rendering it as
an image with `fetchpriority="high"` while preserving the existing crop.

### 15. Validate social and favicon images

- The current social image is `/social_916x509.jpg`, not `/assets/social_916x509.jpg`.
- Create a purpose-built 1200 × 630 social image when branding assets are available.
- Confirm the favicon is square, crawlable, stable, and visually legible at small sizes.
- Do not claim dimensions without inspecting the actual files.

Current audit: `favicon.png` is 16 × 16 and needs a purpose-built square replacement
of at least 48 × 48. `social_916x509.jpg` is actually 916 × 716 and needs a
purpose-built 1200 × 630 replacement. Do not upscale these files and present them as
new assets; create approved brand artwork at the correct dimensions.

---

## Analytics and Search Console

Analytics helps measurement but is not a ranking requirement.

The current `G-XXX` placeholder should not render analytics. Either leave the value
empty until a real GA4 ID is supplied or validate its format in Liquid before loading
the script. Obtain the real ID and consent requirements from the site owner.

Search Console tasks:

- Verify domain ownership, preferably through DNS.
- Submit `/sitemap.xml`.
- Inspect representative page URLs.
- Review indexing, HTTPS, Core Web Vitals, and enhancement reports.

HTTPS redirects, HSTS, and `www` canonicalization are hosting/CDN responsibilities.
Do not add Apache or Nginx configuration without first identifying the production
hosting platform.

---

## Validation

After implementation:

1. Run `bundle exec jekyll build --trace --baseurl=""`.
2. Run `npm.cmd run test:visual`.
3. Inspect generated titles, descriptions, canonicals, robots directives, and JSON-LD.
4. Confirm `/robots.txt` and `/sitemap.xml` return HTTP 200 in production.
5. Validate structured data with Schema.org Validator and supported Google rich-result tests.
6. Use Search Console URL Inspection for Google-rendered output.
7. Use PageSpeed Insights for lab diagnostics and Search Console for field Core Web Vitals.
8. Test Open Graph output with platform sharing debuggers that are currently available.

Do not rely on the retired Google Mobile-Friendly Test or the retired sitelinks search
box report. Responsive behavior is covered locally by Playwright and can also be
inspected through PageSpeed Insights and Search Console.

## Recommended implementation order

1. Repair source encoding and invalid analytics placeholder behavior.
2. Add `jekyll-sitemap` and minimal `robots.txt`.
3. Implement short, unique titles, descriptions, and social metadata.
4. Add page-layout H1 output and correct subordinate heading levels.
5. Improve calculator content and internal links.
6. Verify business facts and then implement structured data.
7. Add measured image dimensions and address confirmed performance findings.
8. Validate production output and submit the sitemap in Search Console.

## Primary references

- [Google: robots.txt introduction](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [Google: build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google: influencing title links](https://developers.google.com/search/docs/appearance/title-link)
- [Google: sitelinks search box retirement](https://developers.google.com/search/blog/2024/10/sitelinks-search-box)
- [Schema.org Validator](https://validator.schema.org/)

*Revised: June 2026*
