import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Heading, Text } from './index';

describe('Typography', () => {
  describe('Heading', () => {
    it('renders as h1 by default', () => {
      render(<Heading>Main Title</Heading>);
      const el = screen.getByText('Main Title');
      expect(el.tagName).toBe('H1');
    });

    it('renders correct level (h3)', () => {
      render(<Heading level={3}>Subtitle</Heading>);
      const el = screen.getByText('Subtitle');
      expect(el.tagName).toBe('H3');
    });
  });

  describe('Text', () => {
    it('renders as p by default', () => {
      render(<Text>Body text</Text>);
      const el = screen.getByText('Body text');
      expect(el.tagName).toBe('P'); // JSDOM might normalize to P or paragraph
    });

    it('renders polymorphically as span', () => {
      render(<Text as="span">Span text</Text>);
      const el = screen.getByText('Span text');
      expect(el.tagName).toBe('SPAN');
    });
  });
});
