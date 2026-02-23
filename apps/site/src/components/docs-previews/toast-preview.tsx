'use client';

import { Button, ToastProvider, useToast } from '8bit-ui';

const ToastTrigger = () => {
  const toast = useToast();

  return (
    <Button type="button" onClick={() => toast.success('Saved!')}>
      Show Toast
    </Button>
  );
};

export const ToastPreview = () => (
  <ToastProvider>
    <ToastTrigger />
  </ToastProvider>
);
