# 8bit-ui

> Build retro-styled web apps with this pixelated React component library inspired by the golden age of handheld gaming.

![Retro Style](https://img.shields.io/badge/style-retro-blue.svg) ![React](https://img.shields.io/badge/react-v19-61dafb.svg)

**8bit-ui** is a lightweight, zero-config component library designed to bring the nostalgic aesthetic of classic handheld gaming and geometric pixel art to modern React applications. It features authentic "pressed" states, notched corners, and blocky typography without sacrificing accessibility or performance.

## Features

- 🎮 **Authentic Retro Styling**: Pixel-perfect borders, notched corners, and tactile depth.
- ⌨️ **Accessible**: Fully supports keyboard navigation and screen readers (focus rings, ARIA attributes).
- 🎨 **Themable**: Built on CSS Variables for easy runtime customization (Themes, Dark Mode).
- ⚛️ **Modern React**: Optimized for React 19+ with functional components and hooks.
- 🧠 **TypeScript Ready**: Includes first-party `.d.ts` typings for all exported components.
- ⚡ **Lightweight**: Zero heavy dependencies.

## Installation

```bash
pnpm add @kagu-project/8bit-ui
# or
npm install @kagu-project/8bit-ui
# or
yarn add @kagu-project/8bit-ui
```

## Setup

Import the global styles in your application's entry point (e.g., `main.tsx`, `main.jsx`, `App.tsx`, or `index.js`):

```javascript
import '@kagu-project/8bit-ui/style.css';
// Note: If running locally without a build step, import './src/theme/index.css' from this package.
```

_Note: You may also need to provide fonts if they aren't bundled by your app. The library uses `Press Start 2P` for headers and `VT323` for body text._

Recommended (privacy + reliability): self-host local `.woff2` files and map them to the CSS variables:

```css
:root {
  --8bit-font-header: 'Press Start 2P', cursive;
  --8bit-font-body: 'VT323', monospace;
}
```

Optional fallback: load from Google Fonts in your HTML head:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap"
  rel="stylesheet"
/>
```

## Usage

```jsx
import React from 'react';
import { Button, Input, Card, Menu } from '@kagu-project/8bit-ui';

const LoginForm = () => {
  return (
    <Card title="Player Login">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Input placeholder="Username" fullWidth />
        <Input type="password" placeholder="Password" fullWidth />

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
          <Menu>
            <Menu.Trigger ariaLabel="Open actions">...</Menu.Trigger>
            <Menu.Content>
              <Menu.Item>Rename</Menu.Item>
              <Menu.Item>Duplicate</Menu.Item>
              <Menu.Separator />
              <Menu.Item danger>Delete</Menu.Item>
            </Menu.Content>
          </Menu>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="link">Cancel</Button>
            <Button variant="solid" color="primary">
              Start Game
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
```

## TypeScript

Type definitions are bundled and exported from the package entrypoint. You can import prop types directly:

```ts
import { Button, type ButtonProps, Menu, type MenuItemProps } from '@kagu-project/8bit-ui';
```

## Export Conditions

This package uses conditional exports:

- `import` / `require` resolve to built files in `dist/` for production/runtime usage.
- `development` resolves to `src/index.ts` to improve local DX in toolchains that support conditional exports.

This behavior is intentional and is validated by the consumer smoke test (`pnpm test:consumer`).

## Validation Scripts

```bash
pnpm typecheck        # strict TS check (library + stories + tests)
pnpm test:coverage    # unit tests with coverage
pnpm build            # runtime bundles + declaration emit
pnpm build-storybook  # storybook static build
pnpm test:consumer    # pack+install+typecheck in a consumer fixture
pnpm lint             # eslint checks
pnpm format:check     # prettier check (no writes)
pnpm lint:fix         # auto-fix eslint findings
pnpm format           # apply prettier formatting
pnpm validate         # runs all of the above in sequence
```

## Releases (Changesets)

```bash
pnpm changeset         # add a release note + bump type for a change
pnpm version-packages  # apply pending changesets to package version/changelog
pnpm release           # build + publish (used when package is publishable)
```

Release flow:

- Add one changeset per PR that should ship.
- On merge to `main`, `.github/workflows/release.yml` opens/updates a "version packages" PR automatically.
- Merge that PR to apply version/changelog updates.
- Publishing can be enabled once this package is no longer `private`.

## Components

| Component       | Description                                                | Variants                              |
| --------------- | ---------------------------------------------------------- | ------------------------------------- |
| **BottomNav**   | Mobile-style bottom navigation bar.                        | `standard`, `floating`                |
| **Button**      | Clickable action element with deep press effect.           | `solid`, `outline`, `link`            |
| **Card**        | Content container with headers and heavy borders.          | `solid`, `outline`                    |
| **Checkbox**    | Pixel-art checkbox with custom checkmark.                  | -                                     |
| **DataTable**   | Data grid with sorting, global/column filters, and paging. | `client`, `server` (modes)            |
| **Drawer**      | Slide-in panel for contextual navigation and actions.      | `left`, `right`, `top`, `bottom`      |
| **Grid**        | Responsive retro grid system.                              | `columns`, `minWidth`, `gap`          |
| **Header**      | Fixed top bar for navigation/branding.                     | `primary`, `secondary`, `transparent` |
| **IconButton**  | Compact icon-only action button.                           | `default`, `outline`, `ghost`         |
| **Input**       | Text field with notched corners.                           | `solid`, `ghost`                      |
| **Layout**      | App shell with flexible padding management.                | -                                     |
| **Menu**        | Context/action menu with keyboard and portal positioning.  | -                                     |
| **Modal**       | Retro dialog with backdrop and animations.                 | `sm`, `md`, `lg`                      |
| **ProgressBar** | Retro health/mana/xp bars with striped animations.         | `solid`, `striped`                    |
| **Radio**       | Pixel-art radio button.                                    | -                                     |
| **Screen**      | Fullscreen retro background with grid/CRT overlays.        | -                                     |
| **Select**      | Custom dropdown with pixel-perfect menu.                   | `solid`, `outline`, `ghost`           |
| **Table**       | Low-level notched table primitives for custom grids.       | -                                     |
| **Tag**         | Small status/label component (Pills).                      | `solid`, `outline`                    |
| **TextArea**    | Multi-line input with notched corners.                     | `solid`, `ghost`                      |
| **Toast**       | Notifications with mechanical "stepped" entrance.          | `step`, `smooth`, `pop`, `none`       |
| **Typography**  | `<Heading>` (8-bit) and `<Text>` (Terminal) components.    | -                                     |

## Theming

Customize the look and feel by overriding CSS variables in your `index.css`:

```css
:root {
  /* Colors */
  --8bit-primary: #ff0055; /* Main Action Color */
  --8bit-secondary: #00bef4; /* Secondary Action */
  --8bit-bg: #f0f0f0; /* App Background */
  --8bit-text: #2d2d2d; /* Text Color */

  /* Fonts */
  --8bit-font-header: 'Press Start 2P', cursive;
  --8bit-font-body: 'VT323', monospace;

  /* Dimensions */
  --8bit-pixel-size: 4px; /* Controls the "chunkiness" of borders */
}
```
