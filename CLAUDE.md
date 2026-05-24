# Sulutopi Website — Agent Rules

Static site project using plain HTML, CSS, and JavaScript. No frameworks, no build step.

## Code Style & Conventions

### General
- Use 2-space indentation across HTML, CSS, and JS.
- Use LF line endings and UTF-8 encoding.
- End every file with a single trailing newline.
- Keep lines under 100 characters where reasonable.
- Prefer clarity over cleverness.

### HTML
- Use semantic HTML5 elements (`<header>`, `<main>`, `<nav>`, `<section>`, `<article>`, `<footer>`) instead of generic `<div>` to improve accessibility, structure, and SEO.
- Use lowercase tags and attributes: `<section class="hero">`, not `<SECTION CLASS="HERO">`.
- Always quote attribute values with double quotes.
- Include `alt` text on every `<img>`. Use `alt=""` only for purely decorative images.
- Use kebab-case for `id` and `class` names: `class="nav-link"`, `id="contact-form"`.
- Place `<script>` tags at the end of `<body>` unless `defer` or `type="module"` is used.
- Self-closing void elements without trailing slash: `<img>`, `<br>`, `<input>` (HTML5 style).

### Accessibility
- Respect the user's `prefers-reduced-motion` setting for all animations and transitions. Wrap motion in `@media (prefers-reduced-motion: no-preference)` or provide a reduced fallback inside `@media (prefers-reduced-motion: reduce)`.
- Ensure all interactive elements are keyboard-accessible and have a visible focus state.
- Maintain sufficient color contrast (WCAG AA minimum).

### Design
- Follow a consistent **8px grid system** for all spacing, margins, padding, and layout to maintain visual harmony. Use multiples of 8 (`8px`, `16px`, `24px`, `32px`, ...); use `4px` only when a half-step is essential.
- Define spacing as CSS custom properties (e.g. `--space-1: 8px; --space-2: 16px;`) and reference them throughout.

### Theme
- Define **all** colors as CSS custom properties in `:root` (e.g. `--color-bg`, `--color-text`, `--color-primary`). Never hardcode color literals in component styles.
- Structure theming so light/dark modes can be added by overriding the variables (e.g. inside `[data-theme="dark"]` or `@media (prefers-color-scheme: dark)`).

### CSS
- Use kebab-case for class names: `.card-title`, not `.cardTitle` or `.card_title`.
- One selector per line in selector lists.
- One property per line, with a space after the colon and a trailing semicolon.
- Group related properties together (positioning, box model, typography, visual).
- Prefer CSS custom properties (`--color-primary`) for repeated values; define them in `:root`.
- Mobile-first media queries: write base styles for small screens, then `@media (min-width: ...)` for larger.
- Avoid `!important` unless overriding third-party styles.
- Use shorthand properties where it improves readability (`margin: 0 auto;`).

### JavaScript
- Use `const` by default; use `let` only when reassignment is required. Never use `var`.
- Use single quotes for strings; use template literals for interpolation.
- Always terminate statements with semicolons.
- Use `===` and `!==` — never `==` or `!=`.
- Use arrow functions for callbacks; use named `function` declarations for top-level functions.
- Use camelCase for variables and functions: `getUserName`, not `get_user_name`.
- Use PascalCase for constructors and classes.
- Use SCREAMING_SNAKE_CASE for true module-level constants.
- Prefer `querySelector` / `querySelectorAll` over `getElementById` / `getElementsByClassName`.
- Use `addEventListener` — never inline `onclick=""` handlers in HTML.
- Use strict mode in scripts that aren't modules: `'use strict';`.

### Comments
- Write comments only where the intent isn't obvious from the code.
- Use `<!-- ... -->` in HTML, `/* ... */` in CSS, and `//` for single-line / `/* ... */` for multi-line in JS.
- No TODO comments without a clear owner or context.

### File & Folder Naming
- Use kebab-case for filenames: `about-us.html`, `main-nav.css`.
- Group related assets together: `/css/`, `/js/`, `/images/`, `/fonts/`.
