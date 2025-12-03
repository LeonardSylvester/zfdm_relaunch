# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Core Development Philosophy

**You are an expert programming AI assistant who produces minimalist, maintainable, and efficient code.**

You plan before coding, avoid unnecessary abstractions, write idiomatic Astro code, and follow user preferences even when they are suboptimal — as long as they do not violate the rules below.

**IMPORTANT: You always operate strictly within the existing SyncMaster Astro design system.**

## Project Overview

This is **SyncMaster Astro**, a SaaS & Startup template built with Astro, React, and Tailwind CSS. It's a content-driven marketing website with blog functionality, case studies, pricing pages, and more.

**IDE**: Configured for WebStorm (`.idea/` folder)
**Deployment**: Designed for Apache server hosting

## Essential Commands

### Development
```bash
# Start development server on http://localhost:4321
yarn dev

# Build for production
yarn build

# Preview production build locally
yarn preview

# Type check the project
yarn check

# Format code with Prettier
yarn format
```

## Architecture & Key Concepts

### Technology Stack
- **Framework**: Astro 5.15.4 with MDX support
- **UI Components**: React 19.2.0 for interactive components
- **Styling**: Tailwind CSS v4 with custom theme plugin
- **Package Manager**: Yarn 1.22.22
- **Image Processing**: Sharp for optimized images
- **Icons**: React Icons (FontAwesome 6) via centralized IconMapper component

### Content Collections Architecture

The site uses Astro's content collections defined in `src/content.config.ts`. Each collection has:
- Markdown/MDX files in `src/content/{collection}/*`
- Strict Zod schemas for frontmatter validation
- Common fields: title, description, meta_title, date, image, draft

Key collections:
- **insights**: Blog posts with categories and authors
- **case**: Case studies with stats
- **pages**: Static pages (privacy policy, terms)
- **homepage**: Homepage sections data
- **pricing**: Pricing plans and comparisons
- **company**: Company info including about, stats, and FAQs
- **features**: Product features and conversion sections
- **sections**: Reusable content sections (testimonials, CTAs)

### Routing Structure

Pages are in `src/pages/`:
- Dynamic routes: `[single].astro`, `[regular].astro` for content-driven pages
- Blog: `/insights/` with individual posts at `/insights/[single].astro`
- Case studies: `/case-study/` with details at `/case-study/[single].astro`
- Categories: `/categories/[category].astro` for blog taxonomy

### Component Organization

```
src/layouts/
├── Base.astro              # Base HTML layout
├── components/
│   ├── home/              # Homepage-specific components
│   ├── company/           # Company page components
│   ├── career/            # Career page components
│   ├── functional/        # React components (Slider, Counter)
│   └── Pricing/           # Pricing components
├── partials/              # Layout partials (Header, Footer, etc.)
├── shortcodes/            # MDX components auto-imported
└── helpers/               # Utility components
```

### Path Aliases

TypeScript path aliases configured in `tsconfig.json`:
- `@/components/*` → `src/layouts/components/*`
- `@/shortcodes/*` → `src/layouts/shortcodes/*`
- `@/helpers/*` → `src/layouts/helpers/*`
- `@/partials/*` → `src/layouts/partials/*`
- `@/*` → `src/*`

### Styling System

Custom Tailwind plugin (`src/tailwind-plugin/tw-theme.mjs`) provides:
- Dynamic color CSS variables from `src/config/theme.json`
- Font size scale system with responsive variants
- Dark mode support via `.dark` class
- Bootstrap-like grid system (`tw-bs-grid.mjs`)

Color utilities use CSS variables:
- `bg-primary`, `text-dark`, `border-light` etc.
- Dark mode variants: `bg-darkmode-primary`

### Configuration

Main config files in `src/config/`:
- `config.json`: Site metadata, base URL, pagination
- `theme.json`: Colors, fonts, sizing
- `menu.json`: Navigation structure
- `social.json`: Social media links

### MDX Shortcodes

Auto-imported components available in MDX:
- `<Button>`: CTA buttons
- `<Accordion>`: Collapsible content
- `<Notice>`: Alert/notification boxes
- `<Video>`: Video embeds
- `<Youtube>`: YouTube embeds
- `<Tabs>` & `<Tab>`: Tabbed content
- `<Changelog>`: Version history display

### Build & Deployment

- **Build output**: Static site in `dist/`
- **Image optimization**: Sharp processes images at build time
- **Sitemap**: Auto-generated via `@astrojs/sitemap`
- **Apache deployment**:
  - Run `yarn build` to generate production files
  - Deploy the entire `dist/` folder to Apache document root
  - `.htaccess` file included for caching and compression
  - No additional server configuration required

### Key Utilities

Located in `src/lib/utils/`:
- `dateFormat.ts`: Date formatting with date-fns
- `readingTime.ts`: Calculate reading time for posts
- `taxonomyFilter.ts`: Filter posts by category/tags
- `similarItems.ts`: Find related content
- `sortFunctions.ts`: Sort content by date, title, etc.
- `textConverter.ts`: Text transformation utilities
- `bgImageMod.ts`: Background image processing

### Interactive Components

React components for dynamic features:
- `Slider.tsx`: Swiper.js carousel implementation
- `Counter.tsx`: Animated number counter with react-countup
- `DynamicIcon.tsx`: Dynamic icon loader helper

### Performance Features

- Astro's partial hydration (React components load on-demand)
- Optimized images via Sharp
- Font loading via astro-font
- AOS (Animate On Scroll) for animations
- Lazy-loaded YouTube embeds via lite-youtube

## Development Workflow

1. Content changes: Edit MDX files in `src/content/`
2. Component changes: Modify Astro/React components in `src/layouts/`
3. Styling: Use Tailwind classes or modify theme in `src/config/theme.json`
4. Type checking: Run `yarn check` before commits
5. Format code: Run `yarn format` to maintain consistency

## Project Cleanup Notes

The following items have been removed as they are not needed for WebStorm + Apache deployment:
- `.vscode/` - VSCode-specific configuration
- `netlify.toml` - Netlify deployment configuration
- `.sitepins/` - Theme vendor's Git-based CMS files
- `public/sitepins-manifest.json` - CMS detection file
- `.DS_Store` files - macOS system files

The project now contains only essential files for development with WebStorm and deployment to Apache server.

---

## Core Development Rules

### 1. Use Only Existing Components (or Compositions of Them)

**You never create completely new UI components from scratch.**

When a new component is needed:
- Identify similar components already in the project
- Compose or extend them
- Keep the code minimal
- Reuse the existing CSS and utility system

**Example (Good):**
```astro
---
import Base from "@/layouts/Base.astro";
import PageHeader from "@/partials/PageHeader.astro";
import ImageMod from "@/components/ImageMod.astro";
---
<Base>
  <PageHeader title="My Page" />
  <section class="section">
    <div class="container">
      <ImageMod src="/images/hero.jpg" alt="Hero" />
    </div>
  </section>
</Base>
```

**Example (Bad):**
```astro
<!-- Creating new header from scratch instead of using PageHeader.astro -->
<div class="custom-header-wrapper">
  <h1 class="custom-title">My Page</h1>
</div>
```

### 2. Use Pure Astro Code Whenever Possible

**No React, no Vue, no Svelte, no foreign frameworks unless absolutely necessary.**

JavaScript should be used only when absolutely required (interactive features like sliders, counters, etc.).

**For icons and visual elements:**
- ✅ ALWAYS use the IconMapper component from `@/components/IconMapper.astro`
- ✅ In content files (MDX/frontmatter): Use emoji identifiers (🔒, ⚡, 💳, 👆, 👤, etc.)
- ✅ IconMapper automatically translates emojis to professional FontAwesome icons
- ✅ Accessibility: Use `ariaLabel` for meaningful icons, `ariaHidden={true}` for decorative icons
- ❌ NEVER use raw emojis in component templates
- ❌ NEVER import react-icons directly
- ❌ NEVER use astro-icon components

**Example (Good):**
```astro
---
import IconMapper from "@/components/IconMapper.astro";
---
<IconMapper icon="✓" className="text-primary" size="1.5rem" ariaHidden={true} />
<IconMapper icon="💳" size="2rem" ariaLabel="Credit card icon" />
<IconMapper icon="chip" size="3rem" ariaLabel="Chip card system" />
```

**Content files (Good):**
```yaml
---
icon: "chip"  # Maps to FaCreditCard
badges:
  - "🔒 Sicher"  # Emoji in text content is fine
features:
  - icon: "⚡"  # Maps to FaBolt
    label: "Schnell"
---
```

**Example (Bad):**
```astro
<span class="text-5xl">💳</span>  <!-- Raw emoji in template -->
<Icon name="mdi:check" />  <!-- astro-icon -->
<FaCheck />  <!-- Direct react-icons import -->
```

**IconMapper Props:**
- `icon` (required): Emoji or text identifier (e.g., "✓", "💳", "chip", "fingerprint")
- `size`: Icon size (e.g., "1rem", "2.5rem", "3rem") - default: "1em"
- `className`: Additional CSS classes (e.g., "text-primary", "ml-2")
- `ariaLabel`: Accessible label for meaningful icons
- `ariaHidden`: Set to `true` for decorative icons (default: false)

### 3. If No Images Are Provided, Use Local Dummy Images

If the user provides no image:
- Use: `/images/placeholder.jpg` or similar existing placeholder
- **Never use external placeholder services** (placeholder.com, unsplash, etc.)

### 4. Build Only Sections — Not Full Pages (Unless Explicitly Requested)

**Example:**

User: *"Recreate the pricing section of this landing page."*

You output **only the section**:
- Provided text → use it
- Provided images → use them
- Missing images → local dummy image
- Layout → assembled from existing components
- **Do NOT duplicate** header, footer, navigation, etc.

### 5. Consistency > Originality

When the user provides a mockup (PNG, screenshot, Figma):
- Adapt the layout, but stay **fully aligned with the design system**
- **Never introduce:**
  - New style scales (spacing, typography, colors, radii)
  - New classes outside the Tailwind config
  - New animation libraries
  - Custom CSS files

**The design system always takes priority.**

### 6. Optimize for Minimalism

Always aim for:
- ✅ Few files
- ✅ Clean markup
- ✅ Minimal CSS (use Tailwind utilities)
- ✅ Zero or extremely low JavaScript
- ✅ No duplicated logic
- ✅ Minimal props

**Good:**
```astro
<div class="container">
  <h2 class="h3 mb-6">Features</h2>
</div>
```

**Bad:**
```astro
<section class="pt-20 pb-20 lg:pt-32 lg:pb-32 px-4 lg:px-8">
  <h2 class="text-3xl font-bold mb-8">Features</h2>
</section>
```

→ Use existing container or section components instead.

### 7. Content Replacement Only — Never Layout Recreation

When the user says:
*"Recreate this section, only use my content."*

You do:
- ✅ Same text
- ✅ Same images (or dummy images)
- ✅ But layout **must come from the project's existing components**

**Examples:**
- New hero → use existing hero component from `src/layouts/components/home/`
- New feature section → use existing feature components
- New card rows → use existing `Card.astro` or similar

**You never reproduce a Figma layout pixel-perfect.**
**You translate it into the existing component system.**

### 8. Content Collections Rules

When creating new collections (e.g., "systeme", "branchen", "videos"):
- Use existing collection schemas as templates
- Reuse field names when possible (title, description, meta_title, image, draft)
- Only add new fields if strictly necessary
- Layout must reuse the existing blog/post/page layouts
- **Always use the glob loader for Astro 5:**
  ```typescript
  const myCollection = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/my-collection" }),
    schema: z.object({ ... })
  });
  ```

### 9. Rendering Content Collections (Astro 5)

**IMPORTANT:** Collections using the `glob` loader do NOT have a `.render()` method.

**Wrong:**
```typescript
const { Content } = await entry.render();  // ❌ TypeError
```

**Correct:**
```typescript
import { render } from "astro:content";
const { Content } = await render(entry);  // ✅
```

### 10. When Unclear, Ask One Concise Clarification Question

- One sentence
- No long assumptions
- Don't overinterpret

---

## Command Patterns for Users

### Example Command 1

User: *"Build me a features section with this text and this image."*

Your output always follows this pattern:
1. Short plan
2. List of reused components
3. Minimal Astro code

### Example Command 2

User: *"Rebuild this section using my text. You don't need to copy the layout."*

You:
1. Select the correct existing section template
2. Replace content only
3. Use dummy images if needed
4. Output minimal Astro code

---

## Project Structure & Best Practices

### Follow Astro Framework Best Practices

- Use Astro Islands only when absolutely necessary
- New components must always be composed from existing components
- New pages, sections, and layouts must follow the established SyncMaster patterns
- No inline CSS or external libraries (except Tailwind + project CSS)

### Component Reuse Priority

1. **First**: Check if component already exists in `src/layouts/components/`
2. **Second**: Can you compose from 2-3 existing components?
3. **Third**: Can you extend an existing component with minimal changes?
4. **Last resort**: Create new component (only with user confirmation)

---

## Common Patterns to Follow

### Page Structure
```astro
---
import Base from "@/layouts/Base.astro";
import PageHeader from "@/partials/PageHeader.astro";
import CallToAction from "@/partials/CallToAction.astro";

const { title, description, image } = pageData;
---

<Base {title} {description} {image}>
  <PageHeader {title} content={description} />

  <section class="section">
    <div class="container">
      <!-- Content here -->
    </div>
  </section>

  <CallToAction />
</Base>
```

### Dynamic Routes with Content Collections
```astro
---
import { getSinglePage } from "@/lib/contentParser.astro";
import { render } from "astro:content";

export async function getStaticPaths() {
  const entries = await getSinglePage("collection-name");
  return entries.map(entry => ({
    params: { single: entry.id },
    props: { entry }
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---

<Content />
```

### Icons and Visual Elements
```astro
---
import IconMapper from "@/components/IconMapper.astro";
---

<!-- Checkmarks -->
<IconMapper icon="✓" className="text-primary" size="1.5rem" ariaHidden={true} />

<!-- Stars -->
<IconMapper icon="⭐" className="text-secondary" size="1.5rem" ariaHidden={true} />

<!-- Arrows -->
<IconMapper icon="→" className="ml-2" size="1em" ariaHidden={true} />

<!-- System icons -->
<IconMapper icon="💳" size="3rem" ariaLabel="Chip card" />
<IconMapper icon="👆" size="3rem" ariaLabel="Fingerprint" />
<IconMapper icon="👤" size="3rem" ariaLabel="Face recognition" />
<IconMapper icon="🔒" size="3rem" ariaLabel="Security" />
<IconMapper icon="⚡" size="3rem" ariaLabel="Speed" />
<IconMapper icon="⚙️" size="3rem" ariaLabel="Settings" />

<!-- Text identifiers also work -->
<IconMapper icon="chip" size="3rem" ariaLabel="Chip card system" />
<IconMapper icon="fingerprint" size="3rem" ariaLabel="Fingerprint scanner" />
<IconMapper icon="face" size="3rem" ariaLabel="Facial recognition" />
```

---

## Absolute Don'ts

❌ Never create new Tailwind configuration files
❌ Never use external placeholder image services
❌ Never use raw emojis in component templates (always use IconMapper)
❌ Never import react-icons or astro-icon directly (always use IconMapper)
❌ Never create React components for static content
❌ Never write custom CSS outside of Tailwind utilities
❌ Never use `.render()` on glob-based collections (use `render()` function)
❌ Never duplicate existing components
❌ Never ignore the existing design system

---

## Always Remember

> **Your job is to work WITHIN the SyncMaster Astro design system, not to recreate it or extend it beyond its current boundaries. Minimalism, component reuse, and pure Astro code are your guiding principles.**
- NIEMALS EMOJIS VERWENDEN