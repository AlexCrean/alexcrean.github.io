# Content Guide

The viewer is split into two layers:

- `tools.js`: publishable documentation data
- `script.js`: viewer logic

To change documentation content, navigation, or publish scope, edit `tools.js` only.

## Group Structure

Each entry in `window.DOCS_VIEWER.groups` defines:

- `slug`: route segment
- `title`: sidebar label
- `landing`: group landing page content
- `pages`: child documentation pages

## Page Structure

Each page entry supports:

- `slug`
- `title`
- `summary`
- `packagePath`
- `notesPath`
- `aliases`
- `keywords`
- `sections`

## Section Structure

Each section supports:

- `heading`
- `defaultOpen`
- `body`: array of paragraphs
- `list`: array of bullet points

## Publishing Scope

If a tool should not appear on the site yet, remove it from the `pages` array in `tools.js`.

If a whole toolkit should not ship yet, remove that group from `window.DOCS_VIEWER.groups`.

## Current Publish Set

- `Shared`
- `Quality Of Life`
  - `Document Inside`
  - `Document Outside`
  - `Don't Edit`
