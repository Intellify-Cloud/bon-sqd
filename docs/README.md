# Bond Squad

Jekyll marketing site with a Webpack-managed JavaScript and Sass asset pipeline.

## Local development

```powershell
bundle install
npm.cmd install
npm.cmd run bundle
bundle exec jekyll serve --baseurl=""
```

Run `npm.cmd run bundle` after changing files in `_assets/`. Generated production
assets are committed in `assets/` for the current deployment workflow.

See [ARCHITECTURE.md](ARCHITECTURE.md) for component, Sass, and content conventions.
