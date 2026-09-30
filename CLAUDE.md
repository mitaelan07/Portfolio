# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML/CSS/JS portfolio website with scroll-triggered animations. No build tools or dependencies required.

## Development

Open `index.html` directly in a browser, or use any local server:

```bash
# Python
python3 -m http.server 8000

# Node (if npx available)
npx serve
```

## Architecture

- **index.html** - Single-page structure with hero, about, projects, and contact sections
- **styles.css** - CSS custom properties for theming, responsive grid layout, animation keyframes
- **script.js** - Intersection Observer API for scroll-triggered `.scroll-fade` animations

## Animation System

- `.fade-in` class: Immediate fade-in animation on page load
- `.scroll-fade` class: Elements animate in when scrolled into view (add to any element)
- Intersection Observer triggers `.visible` class which applies the transition

## Styling Conventions

CSS custom properties defined in `:root` control the color scheme:
- `--color-bg`, `--color-surface` for backgrounds
- `--color-accent`, `--color-accent-hover` for interactive elements
- `--transition-base` (0.3s), `--transition-slow` (0.6s) for timing
