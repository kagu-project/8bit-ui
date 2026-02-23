import type { MDXRemoteProps } from 'next-mdx-remote/rsc';
import * as UI from '8bit-ui';
import {
  BottomNavPreview,
  DataTableActionsPreview,
  DataTableColumnFiltersPreview,
  DataTableRowSelectionPreview,
  DataTableServerModePreview,
  BottomNavFixedPatternPreview,
  LayoutPreview,
  MenuPreview,
  ModalPreview,
  SelectPreview,
  TablePreview,
  ToastPreview,
} from './docs-previews';
import { DocsCodeBlock, DocsDiv } from './docs-mdx-wrappers';

type MDXComponentMap = NonNullable<MDXRemoteProps['components']>;

// Exclude non-component exports (functions, hooks)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { createDataTableActionsColumn, useToast, ...uiComponents } = UI;

const compoundComponents = Object.fromEntries(
  Object.entries(uiComponents).flatMap(([parentName, parentValue]) => {
    if ((typeof parentValue !== 'function' && typeof parentValue !== 'object') || parentValue === null) {
      return [];
    }

    return Object.entries(parentValue)
      .filter(
        ([childName, childValue]) =>
          /^[A-Z]/.test(childName) &&
          ((typeof childValue === 'function' && childValue !== null) ||
            (typeof childValue === 'object' && childValue !== null)),
      )
      .map(([childName, childValue]) => [`${parentName}.${childName}`, childValue]);
  }),
);

const components: MDXComponentMap = {
  ...(uiComponents as MDXComponentMap),
  ...(compoundComponents as MDXComponentMap),
  div: DocsDiv,
  pre: DocsCodeBlock,
  BottomNavPreview,
  DataTableActionsPreview,
  DataTableColumnFiltersPreview,
  DataTableRowSelectionPreview,
  DataTableServerModePreview,
  BottomNavFixedPatternPreview,
  LayoutPreview,
  MenuPreview,
  ModalPreview,
  SelectPreview,
  TablePreview,
  ToastPreview,
};

export { components };
