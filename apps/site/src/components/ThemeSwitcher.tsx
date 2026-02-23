'use client';

import { Menu } from '@kagu-project/8bit-ui';
import { useTheme } from 'next-themes';
import styles from './ThemeSwitcher.module.css';

type ThemeValue = 'light' | 'dark' | 'system';

const normalizeTheme = (theme: string | undefined): ThemeValue => {
  if (theme === 'light' || theme === 'dark' || theme === 'system') {
    return theme;
  }

  return 'system';
};

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const currentTheme = normalizeTheme(theme);

  return (
    <Menu>
      <Menu.Trigger ariaLabel="Theme settings" className={styles.trigger}>
        THEME
      </Menu.Trigger>

      <Menu.Content align="end" className={styles.content}>
        <Menu.Item onSelect={() => setTheme('light')} selected={currentTheme === 'light'}>
          Light
        </Menu.Item>
        <Menu.Item onSelect={() => setTheme('system')} selected={currentTheme === 'system'}>
          System
        </Menu.Item>
        <Menu.Item onSelect={() => setTheme('dark')} selected={currentTheme === 'dark'}>
          Dark
        </Menu.Item>
      </Menu.Content>
    </Menu>
  );
}
