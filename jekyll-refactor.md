# Jekyll refactor assessment

## Implemented

- Application Sass now uses `@use` and `@forward` across `abstracts`, `base`,
  `components`, and `layout`. Bootstrap 4's legacy imports are isolated under
  `vendor`.
- Colors, spacing, typography, shadows, radii, transitions, z-indexes, image paths,
  and breakpoints are centralized in `_assets/abstracts/_tokens.scss`.
- Webpack 5 and Dart Sass replace the Node 24-incompatible Webpack 4/node-sass
  pipeline.
- Contact records and calculator groups are data-driven reusable includes.
- Global navigation and landmarks are centralized in the default layout.
- Duplicate metadata, stylesheets, favicons, Bootstrap Sass imports, navigation
  markup, and calculator markup were removed.
- Keyboard focus, skip navigation, reduced motion, image alternatives, lazy loading,
  canonical URLs, and social-link accessible names were improved.

## Visual review

The home, contact, and calculator pages were rendered at 1440 px, 768 px, and an
iPhone-sized viewport. The visual hierarchy, hero crop, section spacing, cards,
bank-logo grid, testimonials, team layout, footer, contact layout, keyboard focus,
and responsive stacking remain coherent. No horizontal overflow was found.

The review caught and fixed a deferred-script jQuery ordering error that normal
build checks did not expose. The browser suite also validates the collapsed mobile
navigation.

Run:

```powershell
npm.cmd run test:visual
```

Full-page captures are written to `test-results/`.

## Prioritized backlog

### High

- Upgrade Bootstrap 4 and Popper 1 in a dedicated visual-regression change. This
  removes vendor Sass deprecations and the remaining development dependency audit
  findings.
- Confirm whether Facebook customer chat is still required; it adds a third-party
  script to every page.

### Medium

- Add explicit image dimensions once canonical dimensions are approved to further
  reduce layout shift.
- Replace viewport-height calculator iframe sizing with postMessage-based intrinsic
  sizing if the remote calculators support it.
- Consider slightly reducing contact-page mobile heading scale only as a deliberate
  design adjustment; it is readable and does not overflow today.

### Low / safe-removal candidates

- Confirm before deleting unused includes: `articles.html`, `contact.html`,
  `portfolio_grid.html`, `suburbs.html`, and its modal dependency.
- Remove `_assets/**/dist/`, unused image variants, and `favicon(old).png` after
  confirming no external deployment process consumes them.

## Conventions

- New CSS follows component-oriented BEM naming.
- Shared design decisions belong in `abstracts/_tokens.scss`.
- Repeated editorial records belong in `_data`; repeated presentation belongs in
  parameterized includes.
- Internal links use `relative_url`; canonical and social metadata use
  `absolute_url`.
- Preserve one page-level `h1`, logical heading order, visible focus, native
  semantics, and reduced-motion behavior.
