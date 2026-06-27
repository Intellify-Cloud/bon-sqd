# Jekyll Codebase Architecture Refactor Guide

> **Objective:** Refactor and improve the codebase while preserving visual appearance and all existing functionality. Changes should be incremental, safe, and production-ready.

---

## Table of Contents

1. [Guiding Principles](#guiding-principles)
2. [Sass Architecture](#1-sass-architecture)
3. [Design Tokens](#2-design-tokens)
4. [HTML Review](#3-html-review)
5. [Jekyll Architecture](#4-jekyll-architecture)
6. [Component Reuse](#5-component-reuse)
7. [CSS Simplification](#6-css-simplification)
8. [Responsive Design](#7-responsive-design)
9. [Performance](#8-performance)
10. [Accessibility](#9-accessibility)
11. [Liquid Templates](#10-liquid-templates)
12. [Naming Consistency](#11-naming-consistency)
13. [Dead Code](#12-dead-code)
14. [Folder Structure](#13-folder-structure)
15. [Documentation](#14-documentation)
16. [Refactoring Rules](#15-refactoring-rules)
17. [Deliverables](#deliverables)

---

## Guiding Principles

- **Preserve** visual appearance and all functionality
- **Incremental** changes — the site must build successfully after each major change
- **DRY** — eliminate repeated code and centralize shared values
- **Composition** over duplication
- **Modern Sass** — use `@use` and `@forward` instead of deprecated `@import`
- **Long-term maintainability** over short-term convenience

---

## 1. Sass Architecture

Refactor SCSS into a scalable, layered folder structure. This project uses `_assets/` (not `_sass/`) as the source directory, with compiled output going to `/assets/`.

### Current Structure

```
_assets/
├── abstracts/
│   ├── _index.scss           # Entry point — forwards all partials
│   ├── _tokens.scss          # Design tokens (colors, spacing, typography)
│   └── _mixins.scss          # Reusable mixins
│
├── base/
│   ├── _index.scss           # Base layer entry point
│   └── _page.scss            # Base page styles
│
├── components/
│   ├── _index.scss           # Components layer entry point
│   ├── _buttons.scss
│   ├── _navbar.scss
│   └── client-scroll.scss
│
├── layout/
│   ├── _index.scss           # Layout layer entry point
│   ├── _calculators.scss
│   ├── _clients.scss
│   ├── _contact.scss
│   ├── _expert.scss
│   ├── _footer.scss
│   ├── _masthead.scss
│   ├── _portfolio.scss
│   ├── _services.scss
│   ├── _suburbs.scss
│   ├── _team.scss
│   ├── _testimonials.scss
│   └── _textblock.scss
│
├── vendor/
│   └── _bootstrap.scss       # Bootstrap overrides
│
├── dist/                     # Compiled CSS output
│
├── site.scss                 # Main entry point
├── site.js                   # Bundled JS
└── bundle.js                 # Webpack bundle
```

### Target Structure

```
_assets/
├── abstracts/
│   ├── _index.scss           # Entry point — forwards all partials
│   ├── _tokens.scss          # Design tokens (colors, spacing, typography)
│   ├── _mixins.scss          # Reusable mixins
│   └── _breakpoints.scss     # Breakpoint map and media query mixin
│
├── base/
│   ├── _index.scss           # Base layer entry point
│   ├── _page.scss            # Base page styles
│   ├── _reset.scss           # CSS reset / normalize
│   └── _utilities.scss       # Utility classes (text-center, sr-only, etc.)
│
├── components/
│   ├── _index.scss           # Components layer entry point
│   ├── _buttons.scss
│   ├── _navbar.scss
│   ├── _cards.scss
│   ├── _forms.scss
│   └── _client-scroll.scss
│
├── layout/
│   ├── _index.scss           # Layout layer entry point
│   ├── _header.scss
│   ├── _footer.scss
│   ├── _navigation.scss
│   ├── _grid.scss
│   ├── _containers.scss
│   └── (page-specific layouts merged into components or pages/)
│
├── pages/
│   ├── _home.scss
│   ├── _contact.scss
│   └── _services.scss
│
├── vendor/
│   └── _bootstrap.scss       # Bootstrap overrides
│
├── dist/                     # Compiled CSS output
│
├── site.scss                 # Main entry point
├── site.js                   # Bundled JS
└── bundle.js                 # Webpack bundle
```

### Actions

- [ ] Remove all duplicated CSS rules
- [ ] Move repeated values into variables
- [ ] Create reusable mixins for patterns used 3+ times
- [ ] Create utility classes only where semantically appropriate
- [ ] Replace all `@import` with `@use` / `@forward`

---

## 2. Design Tokens

Centralize all design decisions in `_assets/abstracts/`. Avoid magic numbers throughout the codebase.

### Token Categories

```scss
// _colors.scss
$color-primary:        #...;
$color-primary-dark:   #...;
$color-secondary:      #...;
$color-neutral-100:    #...;
$color-text:           #...;
$color-text-muted:     #...;
$color-background:     #...;
$color-error:          #...;

// _spacing.scss
$space-1:  0.25rem;
$space-2:  0.5rem;
$space-4:  1rem;
$space-6:  1.5rem;
$space-8:  2rem;
$space-12: 3rem;
$space-16: 4rem;

// _typography.scss
$font-family-base:     'Inter', sans-serif;
$font-family-heading:  'Inter', sans-serif;
$font-size-sm:         0.875rem;
$font-size-base:       1rem;
$font-size-lg:         1.125rem;
$font-size-xl:         1.25rem;
$font-size-2xl:        1.5rem;
$font-size-4xl:        2.25rem;
$font-weight-normal:   400;
$font-weight-medium:   500;
$font-weight-bold:     700;
$line-height-base:     1.6;
$line-height-heading:  1.2;

// _variables.scss
$border-radius-sm:   4px;
$border-radius-md:   8px;
$border-radius-lg:   16px;
$border-radius-full: 9999px;

$shadow-sm:   0 1px 3px rgba(0,0,0,.08);
$shadow-md:   0 4px 12px rgba(0,0,0,.12);
$shadow-lg:   0 8px 24px rgba(0,0,0,.16);

$z-index-dropdown:  100;
$z-index-sticky:    200;
$z-index-modal:     300;
$z-index-overlay:   400;

$transition-fast:   150ms ease;
$transition-base:   250ms ease;
$transition-slow:   400ms ease;

// Gradients
$gradient-primary:  linear-gradient(135deg, $color-primary, $color-primary-dark);

// _breakpoints.scss
$breakpoints: (
  'sm':  480px,
  'md':  768px,
  'lg':  1024px,
  'xl':  1280px,
  '2xl': 1536px,
);

@mixin respond-to($bp) {
  @media (min-width: map-get($breakpoints, $bp)) { @content; }
}
```

---

## 3. HTML Review

### Goals

- Identify repeated HTML patterns and extract them into Jekyll includes
- Improve semantic HTML and landmark usage
- Replace hardcoded content with data-driven templates

### Actions

- [ ] Audit every page for repeated markup blocks
- [ ] Convert repeated structures into `_includes/` partials
- [ ] Use `<main>`, `<nav>`, `<header>`, `<footer>`, `<section>`, `<article>` correctly
- [ ] Replace `<div>` used as buttons with `<button>` elements
- [ ] Ensure heading hierarchy is logical (no skipped levels)
- [ ] Move repeated call-to-action blocks into a single include

### Example Refactor

**Before** — repeated in multiple pages:
```html
<div class="cta-block">
  <h2>Ready to get started?</h2>
  <a href="/contact" class="btn btn--primary">Contact Us</a>
</div>
```

**After** — single reusable include:
```html
{% include cta-block.html
   heading="Ready to get started?"
   link="/contact"
   label="Contact Us" %}
```

---

## 4. Jekyll Architecture

### Review Checklist

| Area | Questions to Answer |
|------|-------------------|
| **Layouts** | Are layouts minimal and composable? Is there unnecessary duplication between layouts? |
| **Includes** | Are includes parameterized? Do any includes duplicate logic? |
| **Collections** | Should any repeated page type (team, services, case studies) become a collection? |
| **Data files** | Should navigation, pricing, testimonials, FAQs, or logos move to `_data/`? |
| **Config** | Are site-wide settings (name, URL, social links) in `_config.yml`? |
| **Front Matter** | Is front matter consistent and minimal? Are defaults set in config? |
| **Pagination** | Is pagination configured via the gem rather than manual HTML? |
| **Liquid** | Are there repeated Liquid blocks that could be extracted? |

### Content Source Recommendations

Move the following to data files or collections instead of hardcoded HTML:

```
_data/
├── navigation.yml        # Main nav links
├── footer.yml            # Footer links and columns
├── services.yml          # Service cards
├── pricing.yml           # Pricing tiers and features
├── testimonials.yml      # Testimonial quotes and authors
├── faqs.yml              # FAQ questions and answers
├── logos.yml             # Client/partner logos
└── social.yml            # Social media links
```

### Front Matter Defaults (`_config.yml`)

```yaml
defaults:
  - scope:
      path: ""
      type: "posts"
    values:
      layout: "post"
      author: "Site Author"
  - scope:
      path: "services"
    values:
      layout: "service"
```

---

## 5. Component Reuse

Identify components that appear more than once and build parameterized includes.

### Components to Centralize

| Component | Current State | Target |
|-----------|--------------|--------|
| Buttons | Duplicated markup | `_includes/button.html` |
| Cards | Repeated structures | `_includes/card.html` |
| Feature lists | Copy-pasted HTML | Data-driven loop |
| Pricing cards | Hardcoded tiers | `_data/pricing.yml` + include |
| Testimonials | Inline HTML | `_data/testimonials.yml` + include |
| Logo rows | Hardcoded `<img>` tags | `_data/logos.yml` + include |
| Badges / tags | Repeated `<span>` patterns | `_includes/badge.html` |
| CTA blocks | Duplicated per page | `_includes/cta.html` |

### Example — Parameterized Card Include

`_includes/card.html`:
```html
<div class="card{% if include.modifier %} card--{{ include.modifier }}{% endif %}">
  {% if include.icon %}
    <div class="card__icon">{{ include.icon }}</div>
  {% endif %}
  <h3 class="card__title">{{ include.title }}</h3>
  <p class="card__body">{{ include.body }}</p>
  {% if include.link %}
    <a href="{{ include.link }}" class="card__link">{{ include.link_label | default: "Learn more" }}</a>
  {% endif %}
</div>
```

---

## 6. CSS Simplification

### Naming Convention — BEM

Use BEM consistently across all components:

```
.component                  Block
.component__element         Element
.component--modifier        Modifier
```

### Rules

- [ ] Reduce selector nesting to a maximum of 3 levels
- [ ] Remove all `!important` unless absolutely required (document any kept)
- [ ] Replace deeply chained selectors with BEM class names
- [ ] Remove redundant property declarations (same property set twice)
- [ ] Audit for overridden values that cancel each other out

### Example Refactor

**Before:**
```scss
.section .content-area > div.card > h3 { ... }
.section .content-area > div.card > p { ... }
```

**After:**
```scss
.card__title { ... }
.card__body  { ... }
```

---

## 7. Responsive Design

### Approach

- **Mobile-first** — base styles target small screens; breakpoints add complexity upward
- Use the `respond-to()` mixin from `_assets/abstracts/_breakpoints.scss` everywhere
- Avoid breakpoint values defined inline — always reference the `$breakpoints` map

### Review Checklist

- [ ] All layouts use mobile-first media queries
- [ ] Container max-widths are consistent and token-driven
- [ ] Spacing scales down correctly on small screens
- [ ] Navigation collapses gracefully on mobile
- [ ] Images use `max-width: 100%` and appropriate `sizes` attributes
- [ ] No redundant or conflicting media queries (merge where possible)
- [ ] Touch targets are at least 44×44px

---

## 8. Performance

### Audit Areas

| Area | Action |
|------|--------|
| Unused CSS | Identify and remove rules that match no HTML |
| Duplicate CSS | Consolidate into tokens and shared rules |
| Image loading | Add `loading="lazy"` to below-fold images |
| Font loading | Use `font-display: swap`; subset fonts |
| Critical CSS | Inline above-fold styles if render-blocking is an issue |
| Animations | Use `transform` and `opacity` only (GPU composited) |
| DOM complexity | Reduce nesting depth; remove wrapper divs with no purpose |
| JS | Defer non-critical scripts; remove unused dependencies |

### Image Best Practices

```html
<!-- Hero image (above fold — do not lazy load) -->
<img src="/assets/images/hero.webp" alt="..." width="1200" height="600">

<!-- Below-fold images -->
<img src="/assets/images/feature.webp" alt="..." width="600" height="400" loading="lazy">
```

---

## 9. Accessibility

### Review Checklist

- [ ] **Landmarks** — `<main>`, `<nav>`, `<header>`, `<footer>` present and correct
- [ ] **Heading hierarchy** — one `<h1>` per page; no skipped levels
- [ ] **Buttons** — use `<button>` for actions; `<a>` only for navigation
- [ ] **Keyboard navigation** — all interactive elements reachable and operable by keyboard
- [ ] **Focus states** — visible focus ring on all interactive elements (never `outline: none` without a replacement)
- [ ] **Color contrast** — text meets WCAG AA (4.5:1 for body, 3:1 for large text)
- [ ] **Images** — all `<img>` have descriptive `alt` text; decorative images use `alt=""`
- [ ] **Forms** — every input has a visible `<label>`; errors are associated via `aria-describedby`
- [ ] **ARIA** — use ARIA only where native HTML semantics are insufficient; no redundant roles
- [ ] **Skip link** — "Skip to main content" link as the first focusable element

### Skip Link Example

```html
<a href="#main-content" class="skip-link">Skip to main content</a>
```

```scss
.skip-link {
  position: absolute;
  top: -100%;
  left: 1rem;
  padding: $space-2 $space-4;
  background: $color-primary;
  color: #fff;
  z-index: $z-index-overlay;

  &:focus {
    top: 1rem;
  }
}
```

---

## 10. Liquid Templates

### Actions

- [ ] Extract repeated Liquid blocks into include files with parameters
- [ ] Replace repeated conditional chains with data lookups
- [ ] Avoid unnecessary `for` loops where `assign` or `where` filters suffice
- [ ] Simplify complex conditions — break into `assign` statements for readability

### Example Refactor

**Before** — repeated on multiple pages:
```liquid
{% for item in site.data.services %}
  <div class="card">
    <h3>{{ item.title }}</h3>
    <p>{{ item.description }}</p>
  </div>
{% endfor %}
```

**After** — extracted to include:
```liquid
{% include components/service-grid.html services=site.data.services %}
```

---

## 11. Naming Consistency

Adopt one convention across the entire project and apply it everywhere.

### Recommended Convention

| Area | Convention | Example |
|------|-----------|---------|
| CSS classes | BEM | `.pricing-card__title--featured` |
| SCSS files | kebab-case with underscore prefix | `_pricing-card.scss` |
| Includes | kebab-case | `pricing-card.html` |
| Layouts | kebab-case | `page-with-sidebar.html` |
| Data files | kebab-case | `pricing-tiers.yml` |
| SCSS variables | kebab-case with `$` | `$color-primary` |
| SCSS mixins | kebab-case | `@mixin respond-to` |
| SCSS functions | kebab-case | `@function rem-calc` |
| Images | kebab-case | `hero-background.webp` |
| JS files | kebab-case | `mobile-nav.js` |

---

## 12. Dead Code

Audit and safely remove:

- [ ] **Unused includes** — includes that are never called with `{% include %}`
- [ ] **Unused layouts** — layouts not referenced in any page front matter
- [ ] **Unused SCSS partials** — files not forwarded in `_assets/abstracts/_index.scss`
- [ ] **Unused SCSS variables** — variables defined but never referenced
- [ ] **Unused images** — assets in `/assets/img/` not referenced in any HTML or CSS
- [ ] **Unused JS** — scripts not referenced or with no active callers
- [ ] **Unused data files** — `_data/` files not accessed in any template

> **Safe removal process:** search for the file/variable/class name across the entire project before deleting. Use git to stage removals separately so they can be reverted cleanly.

---

## 13. Folder Structure

### Current Structure

```
project-root/
├── _assets/                  # Sass source and compiled output
│   ├── abstracts/            # Tokens, mixins, entry point
│   ├── base/                 # Base styles
│   ├── components/           # Reusable UI components
│   ├── layout/               # Page-specific layout sections
│   ├── vendor/               # Third-party overrides (Bootstrap)
│   └── dist/                 # Compiled CSS output
│
├── assets/                   # Site assets (images, fonts, compiled bundle)
│   ├── img/                  # Images (clients, portfolio, team)
│   └── (fonts, .js, .css)    # Compiled bundle and fonts
│
├── _data/                    # Structured content
│   ├── contacts.yml
│   ├── navigation.yml
│   └── sitetext.yml
│
├── _drafts/                  # Draft posts
│   └── 2021-04-22-First-Time-Home-Buyers-Guide-Buy-Like-a-Pro.md
│
├── _includes/                # Reusable includes (flat structure)
│   ├── about.html
│   ├── articles.html
│   ├── calculator-section.html
│   ├── calculators.html
│   ├── calculators2.html
│   ├── clients.html
│   ├── contact-card.html
│   ├── contact.html
│   ├── expert.html
│   ├── footer.html
│   ├── head.html
│   ├── hero.html
│   ├── modals.html
│   ├── nav.html
│   ├── portfolio_grid.html
│   ├── services.html
│   ├── suburbs.html
│   ├── team.html
│   ├── testimonials.html
│   └── textblock.html
│
├── _layouts/                 # Page layout templates
│   ├── default.html
│   ├── home.html
│   ├── page.html
│   └── post.html
│
├── _portfolio/               # Portfolio collection
│   ├── example.md
│   ├── project1.md
│   └── project2.md
│
├── _site/                    # Jekyll generated output
│
├── .agents/                  # Agent configurations
├── _config.yml
├── Gemfile
└── jekyll-refactor.md        # This document
```

### Target Structure

```
project-root/
├── _assets/                  # Sass source and compiled output
│   ├── abstracts/            # Tokens, mixins, entry point
│   ├── base/                 # Base styles, reset, utilities
│   ├── components/           # Reusable UI components
│   ├── layout/               # Header, footer, nav, grid
│   ├── pages/                # Page-specific styles
│   └── vendor/               # Third-party overrides
│
├── _data/                    # Structured content
│   ├── contacts.yml
│   ├── navigation.yml
│   └── sitetext.yml
│
├── _drafts/                  # Draft posts
│
├── _includes/                # Reusable includes
│   ├── components/           # Reusable UI components (card, button, cta, etc.)
│   ├── layout/               # Header, footer, nav
│   └── sections/             # Page sections (hero, testimonials, features)
│
├── _layouts/                 # Page layout templates
├── _portfolio/               # Portfolio collection
├── _site/                    # Jekyll generated output
├── assets/                   # Site assets (images, fonts, compiled bundle)
├── .agents/                  # Agent configurations
├── _config.yml
├── Gemfile
└── index.html
```

### Principles

- Group files by **feature/purpose**, not by file type alone
- Keep individual files **small and focused** — split when a file exceeds ~150 lines
- Only split files when it genuinely improves navigability

---

## 14. Documentation

### What to Document

- **`_assets/abstracts/`** — comment each token group with its purpose
- **Includes** — add a usage comment at the top of each include listing available parameters
- **Mixins** — document parameters and usage example
- **Architecture decisions** — add a `ARCHITECTURE.md` at the root for non-obvious choices

### Include Header Convention

```html
<!--
  Include: card.html
  Description: Reusable content card with optional icon, link, and modifier.

  Parameters:
    title       (required) Card heading text
    body        (required) Card description text
    icon        (optional) Icon HTML or SVG string
    link        (optional) URL for the card link
    link_label  (optional) Link text — defaults to "Learn more"
    modifier    (optional) BEM modifier class suffix (e.g. "featured")
-->
```

### SCSS Comment Convention

```scss
// =============================================================================
// PRICING CARD
// Displays a single pricing tier with features list and CTA button.
// Used in: _includes/sections/pricing.html
// =============================================================================

.pricing-card { ... }
```

> Add comments only where they add value. Do not comment self-explanatory code.

---

## 15. Refactoring Rules

1. **Preserve visual appearance** — changes must not alter how the site looks
2. **Preserve all functionality** — links, forms, animations, and interactions must still work
3. **Make incremental, safe changes** — verify the site builds after each significant change
4. **Prefer composition over duplication** — build from small, reusable parts
5. **Keep files small and focused** — one responsibility per file
6. **Eliminate repeated code** — apply DRY across HTML, Sass, and Liquid
7. **Centralize shared values** — tokens live in `_assets/abstracts/`; content lives in `_data/`
8. **Follow the DRY principle** — define once, reference everywhere
9. **Optimize for long-term maintainability** — a future developer should be able to navigate the codebase without asking for help
10. **Use modern Sass** — `@use` and `@forward` only; no `@import`

---

## Deliverables

### 1. Architectural Assessment
A documented review of the current project identifying structural weaknesses, duplication, and technical debt.

### 2. Prioritized Improvement List

| Priority | Area | Description |
|----------|------|-------------|
| 🔴 High | Design tokens | Centralize all colors, spacing, and typography |
| 🔴 High | Sass architecture | Restructure into abstracts/base/layout/components/pages |
| 🔴 High | Component includes | Extract repeated HTML into parameterized includes |
| 🔴 High | Data files | Move pricing, FAQs, testimonials, nav to `_data/` |
| 🟡 Medium | BEM naming | Audit and rename CSS classes consistently |
| 🟡 Medium | Responsive refactor | Enforce mobile-first, remove redundant breakpoints |
| 🟡 Medium | Accessibility | Fix heading hierarchy, add skip link, audit ARIA |
| 🟡 Medium | Dead code removal | Identify and remove unused files and variables |
| 🟢 Low | Documentation | Add include headers and SCSS section comments |
| 🟢 Low | Performance | Add lazy loading, review font loading strategy |
| 🟢 Low | Folder structure | Reorganize includes into components/layout/sections |

### 3. Incremental Refactor Plan
Each phase below should build successfully before proceeding to the next.

- **Phase 1** — Sass restructure and design tokens
- **Phase 2** — Data files and Liquid template extraction
- **Phase 3** — HTML include refactor and component centralization
- **Phase 4** — BEM renaming and CSS simplification
- **Phase 5** — Accessibility and performance pass
- **Phase 6** — Dead code removal and documentation

### 4. Final Summary (to be completed after refactor)

| Metric | Before | After |
|--------|--------|-------|
| SCSS files | | |
| Lines of CSS (total) | | |
| Duplicated CSS rules removed | | |
| Components centralized | | |
| Includes created | | |
| Data files created | | |
| Accessibility issues resolved | | |
| Unused files removed | | |

---

*This document should be treated as a living specification. Update it as refactoring progresses and decisions are made.*