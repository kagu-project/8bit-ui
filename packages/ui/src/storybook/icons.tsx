import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export const PlusIcon = (props: IconProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5z" />
  </svg>
);

export const EditIcon = (props: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
);

export const DownloadIcon = (props: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M5 20h14v-2H5v2zm7-18v10.17l3.59-3.58L17 10l-5 5-5-5 1.41-1.41L11 12.17V2h1z" />
  </svg>
);

export const TrashIcon = (props: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M9 3h6l1 2h5v2H3V5h5l1-2zm1 6h2v9h-2V9zm4 0h2v9h-2V9zM7 9h2v9H7V9z" />
  </svg>
);

export const HamburgerMenuIcon = (props: IconProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M3 4h18v4H3zm0 6h18v4H3zm0 6h18v4H3z" />
  </svg>
);

export const CloseIcon = (props: IconProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M2 2h4v4H2z M18 2h4v4h-4z M6 6h4v4H6z M14 6h4v4h-4z M10 10h4v4h-4z M6 14h4v4H6z M14 14h4v4h-4z M2 18h4v4H2z M18 18h4v4h-4z" />
  </svg>
);
