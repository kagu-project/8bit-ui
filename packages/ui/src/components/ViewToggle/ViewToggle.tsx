import type { CSSProperties, HTMLAttributes } from 'react';
import { ToggleGroup, type ToggleGroupItem } from '../ToggleGroup';
import styles from './ViewToggle.module.css';

export type ViewToggleValue = 'grid' | 'list';

export interface ViewToggleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  view?: ViewToggleValue;
  onChange?: (view: ViewToggleValue) => void;
  style?: CSSProperties;
}

const ViewToggle = ({
  view = 'grid',
  onChange,
  className = '',
  style = {},
  ...props
}: ViewToggleProps) => {
  const handleToggle = (newView: ViewToggleValue) => {
    if (!onChange) {
      return;
    }

    if (view === newView) {
      onChange(view === 'grid' ? 'list' : 'grid');
      return;
    }

    onChange(newView);
  };

  const items: ToggleGroupItem<ViewToggleValue>[] = [
    {
      value: 'grid',
      label: 'Grid View',
      icon: <span className={`${styles.icon} ${styles.iconGrid}`} />,
    },
    {
      value: 'list',
      label: 'List View',
      icon: <span className={`${styles.icon} ${styles.iconList}`} />,
    },
  ];

  return (
    <ToggleGroup<ViewToggleValue>
      className={className}
      style={style}
      value={view}
      onValueChange={handleToggle}
      allowReselect
      items={items}
      ariaLabel="View mode"
      {...props}
    />
  );
};

export default ViewToggle;
