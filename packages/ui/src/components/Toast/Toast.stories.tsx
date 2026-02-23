import { ToastProvider, useToast } from './ToastContext';
import Button from '../Button';

export default {
  title: '8bitUI/Components/Toast',
  component: ToastProvider,
};

const ToastDemo = () => {
  const toast = useToast();

  return (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3>Types</h3>
        <Button onClick={() => toast.info('New Message Received!')}>Info Toast</Button>
        <Button
          variant="outline"
          color="secondary"
          onClick={() => toast.success('Game Saved Successfully!')}
        >
          Success Toast
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3>Animations</h3>
        <Button
          variant="link"
          onClick={() => toast.success('Stepped Slide (Default)', { animation: 'step' })}
        >
          Step Animation
        </Button>
        <Button variant="link" onClick={() => toast.info('Smooth Slide', { animation: 'smooth' })}>
          Smooth Animation
        </Button>
        <Button variant="link" onClick={() => toast.warning('Pop Logic!', { animation: 'pop' })}>
          Pop Animation
        </Button>
        <Button
          variant="link"
          onClick={() => toast.error('Instant (No Animation)', { animation: 'none' })}
        >
          None (Instant)
        </Button>
      </div>
    </div>
  );
};

export const Interactive = () => (
  <ToastProvider>
    <div style={{ padding: 20, height: 400 }}>
      <ToastDemo />
    </div>
  </ToastProvider>
);
