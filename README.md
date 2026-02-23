# 8bit-ui

This repository is organized as a pnpm workspace.

## Workspace Layout

- `packages/ui` - the `8bit-ui` React component library.
- `apps/site` - the Next.js marketing + docs site.
- `docs` - MDX documentation content consumed by the docs site.

## Common Commands

Run from the repository root:

```bash
pnpm install
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test:coverage
pnpm build
pnpm build-storybook
pnpm test:consumer
```

## App Commands

```bash
pnpm dev:site
pnpm build:site
```

## Package Commands

```bash
pnpm dev
pnpm storybook
pnpm validate
```

## Releases

```bash
pnpm changeset
pnpm version-packages
pnpm release
```
