import Heading from './Heading';
import Text from './Text';

export default {
  title: '8bitUI/Foundations/Typography',
  // We can't set a single component here easily, so we just group them
};

export const Headings = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <Heading level={1}>Heading Level 1</Heading>
    <Heading level={2}>Heading Level 2</Heading>
    <Heading level={3}>Heading Level 3</Heading>
    <Heading level={4}>Heading Level 4</Heading>
    <Heading level={5}>Heading Level 5</Heading>
    <Heading level={6}>Heading Level 6</Heading>
  </div>
);

export const Colors = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <Heading level={3} variant="primary">
      Primary Heading
    </Heading>
    <Heading level={3} variant="secondary">
      Secondary Heading
    </Heading>
    <Heading level={3} variant="danger">
      Danger Heading
    </Heading>
    <Heading level={3} variant="neutral">
      Neutral Heading
    </Heading>
  </div>
);

export const BodyText = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
    <Heading level={4} style={{ marginBottom: 0 }}>
      Sizes
    </Heading>
    <div style={{ border: '1px solid #333', padding: 8 }}>
      <Text size="sm">Small text (16px) - Good for captions or dense stats.</Text>
      <Text size="md">Medium text (20px) - Standard body reading size.</Text>
      <Text size="lg">Large text (24px) - Emphasis or descriptions.</Text>
    </div>

    <Heading level={4} style={{ marginBottom: 0 }}>
      Usage Example
    </Heading>
    <div style={{ border: '2px dashed #333', padding: 16 }}>
      <Heading level={2} variant="primary">
        QUEST UPDATED
      </Heading>
      <Text size="lg" weight="bold" style={{ marginBottom: 8 }}>
        Objective: Retrieve the Crystal
      </Text>
      <Text size="md">
        The ancient crystal is located in the{' '}
        <Text as="span" variant="danger">
          Dungeon of Despair
        </Text>
        . Bring it back to the village elder before sunset.
      </Text>
    </div>
  </div>
);
