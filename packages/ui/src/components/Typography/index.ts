import Heading from './Heading';
import Text from './Text';

export interface TypographyBundle {
  Heading: typeof Heading;
  Text: typeof Text;
}

const Typography: TypographyBundle = {
  Heading,
  Text,
};

export default Typography;
export { Heading, Text };
export type { HeadingProps } from './Heading';
export type { TextProps } from './Text';
