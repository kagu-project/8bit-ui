import type { ComponentPropsWithoutRef } from 'react';

const classList = (...values: Array<string | undefined>) => values.filter(Boolean).join(' ');

export const DocsCodeBlock = ({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'pre'>) => (
  <pre className={classList('docsCodeBlock', className)} {...props}>
    {children}
  </pre>
);

export const DocsDiv = ({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'div'>) => {
  if (typeof className === 'string' && className.split(/\s+/).includes('preview')) {
    return (
      <div className={classList('docsPreviewFrame', className)} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};
