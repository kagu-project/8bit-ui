# 8bit-ui

## 0.2.2

### Patch Changes

- 3226a2f: Upgrade the library's Vite and Vitest toolchain to patched supported versions, and preserve the published `@kagu-project/8bit-ui/style.css` export under Vite 7.

## 0.2.1

### Patch Changes

- c6cc0bc: Enhanced the `FAB` component with robust keyboard interaction support and refined style adjustments. Also fixed both the `Button` and `FAB` components to ensure their `type` attribute safely defaults to `'button'` and correctly handles invalid HTML types.

## 0.2.0

### Minor Changes

- ea5e00a: Added new public exports for `IconButton` and `Drawer` (including related `Drawer*` and `IconButtonProps` types), introducing new interactive primitives for consumer apps.

  Also includes supporting style/usability refinements and docs examples for improved mobile behavior and component presentation.

### Patch Changes

- 3c6665d: Improved `Drawer` accessibility and runtime robustness by ensuring valid dialog naming behavior (`aria-label`/`aria-labelledby` handling), adding an SSR-safe portal guard, and documenting the naming contract.

  Also tightened package quality gates by enabling strict Storybook a11y checks and raising test coverage thresholds for long-term release confidence.

## 0.1.0

### Minor Changes

- efa8f7d: Initial public release under the @kagu-project/8bit-ui scope.
