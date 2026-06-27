# Frontend architecture

## Structure

- `_layouts/`: document shells. `default.html` owns global landmarks, navigation,
  metadata, and the footer.
- `_includes/`: reusable Liquid components and page sections.
- `_data/`: structured editorial content. Contact records and section content live
  here rather than in presentation templates.
- `_assets/abstracts/`: design tokens and mixins; emits no CSS by itself.
- `_assets/base/`: global element styles, typography, focus, and page utilities.
- `_assets/components/`: reusable UI components.
- `_assets/layout/`: section-level and structural styles.
- `_assets/vendor/`: third-party compatibility boundaries.
- `assets/`: generated CSS/JS and deployable static files.

Sass uses `@use` and `@forward`. Bootstrap 4's internal legacy `@import` is
isolated in `vendor/_bootstrap.scss`; application files must not add legacy imports.
Every component imports tokens explicitly with `@use '../abstracts' as *`.

## Conventions

- CSS: component-oriented BEM for new code
  (`.component`, `.component__element`, `.component--modifier`). Existing
  Bootstrap utility classes remain until the framework is upgraded.
- Sass: kebab-case partial names and semantic tokens. Add shared values to
  `abstracts/_tokens.scss`; avoid component-specific tokens there.
- Liquid: kebab-case include names. Pass data through include parameters and keep
  repeated editorial records in `_data`.
- HTML: one `h1` per page, heading levels in order, native controls before ARIA,
  descriptive image alternatives, and landmarks owned by layouts.
- URLs: pass internal paths through `relative_url`; use `absolute_url` for
  canonical and social metadata.

## Reusable components

- `contact-card.html` renders records from `_data/contacts.yml`.
- `calculator-section.html` renders both calculator groups from
  `_data/sitetext.yml`.
- Navigation, hero, clients, services, testimonials, team, and footer are global
  section components.

## Build decisions

Webpack 5 and Dart Sass support the current Node runtime. CSS and JavaScript are
minified in production. Bootstrap 4 and jQuery remain intentionally in place to
preserve navbar, scrollspy, and visual behavior.

## Review findings and backlog

### High impact

- Upgrade Bootstrap 4/Popper 1 to a supported framework version. This removes the
  remaining vendor Sass deprecation warnings and the final high-severity transitive
  audit finding, but requires dedicated visual regression testing.
- Replace the third-party Facebook customer-chat integration if it is no longer
  required; it adds network cost and global JavaScript to every page.
- Add screenshot regression coverage at 440, 768, 992, and 1200 px before deeper
  selector or framework changes.

### Medium impact

- Consolidate the remaining section heading markup into a parameterized include
  after confirming whether Markdown is required in each title.
- Convert calculator iframes to a postMessage-driven intrinsic height if the remote
  calculators support it; current viewport-height rules are necessarily brittle.
- Add width and height attributes to editorial images once canonical dimensions are
  captured, reducing layout shift.
- Move the home-page section order to a data file only if editors need to reorder
  sections; the explicit layout is currently easier to follow.

### Low impact / safe cleanup candidates

- Unreferenced includes: `articles.html`, `contact.html`, `portfolio_grid.html`,
  and `suburbs.html`. `modals.html` is referenced only by the unused portfolio
  include. Confirm they are not planned features before deleting.
- Generated development artifacts under `_assets/**/dist/` are not part of the
  build and can be removed after deployment owners confirm they are not used by an
  external process.
- Several legacy image variants and `favicon(old).png` appear unused. Verify
  production analytics and external deep links before removing binary assets.

## Accessibility and performance checklist

New components must preserve keyboard focus visibility, honor reduced motion, avoid
empty links, label icon-only links, and lazy-load below-the-fold images. Do not lazy
load the hero/LCP image. Keep third-party scripts deferred where their API permits it.
