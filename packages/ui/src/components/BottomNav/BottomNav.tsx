import type {
  ButtonHTMLAttributes,
  CSSProperties,
  FC,
  HTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from 'react';
import Button from '../Button';
import styles from './BottomNav.module.css';

export type BottomNavVariant = 'standard' | 'floating';

export interface BottomNavProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  variant?: BottomNavVariant;
  style?: CSSProperties;
}

export interface BottomNavItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  label?: ReactNode;
  active?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export interface BottomNavActionProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'color' | 'onClick'
> {
  icon?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export interface BottomNavComponent extends FC<BottomNavProps> {
  Item: FC<BottomNavItemProps>;
  Action: FC<BottomNavActionProps>;
}

const BottomNavBase = ({
  children,
  variant = 'standard',
  className = '',
  style,
  ...props
}: BottomNavProps) => {
  return (
    <nav className={`${styles.bottomNav} ${styles[variant]} ${className}`} style={style} {...props}>
      {children}
    </nav>
  );
};

const Item = ({
  icon,
  label,
  active = false,
  onClick,
  className = '',
  ...props
}: BottomNavItemProps) => {
  return (
    <button
      type="button"
      className={`${styles.item} ${active ? styles.active : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {label && <span className={styles.label}>{label}</span>}
    </button>
  );
};

const Action = ({ icon, onClick, className = '', ...props }: BottomNavActionProps) => {
  return (
    <div className={`${styles.actionItem} ${className}`}>
      <Button
        variant="solid"
        color="secondary"
        onClick={onClick}
        {...props}
        style={{
          width: '100%',
          height: '100%',
          padding: 0,
          minWidth: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Button>
    </div>
  );
};

const BottomNav = BottomNavBase as BottomNavComponent;

BottomNav.Item = Item;
BottomNav.Action = Action;

export default BottomNav;
