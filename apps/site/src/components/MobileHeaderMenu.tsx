'use client';

import { Menu } from '@kagu-project/8bit-ui';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import styles from './MobileHeaderMenu.module.css';

type ThemeValue = 'light' | 'dark' | 'system';

const normalizeTheme = (theme: string | undefined): ThemeValue => {
  if (theme === 'light' || theme === 'dark' || theme === 'system') {
    return theme;
  }

  return 'system';
};

interface MobileHeaderMenuProps {
  repoUrl: string;
}

export function MobileHeaderMenu({ repoUrl }: MobileHeaderMenuProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const currentTheme = normalizeTheme(theme);

  const openRepo = () => {
    window.open(repoUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={styles.wrapper}>
      <Menu>
        <Menu.Trigger ariaLabel="Open settings menu" className={styles.trigger}>
          Settings
        </Menu.Trigger>

        <Menu.Content align="end" className={styles.content}>
          <Menu.Item className={styles.item} onSelect={() => router.push('/docs/')}>
            Docs
          </Menu.Item>
          <Menu.Item className={styles.item} onSelect={openRepo}>
            GitHub
          </Menu.Item>

          <Menu.Separator />

          <Menu.Item
            className={styles.item}
            onSelect={() => setTheme('light')}
            selected={currentTheme === 'light'}
          >
            Theme: Light
          </Menu.Item>
          <Menu.Item
            className={styles.item}
            onSelect={() => setTheme('system')}
            selected={currentTheme === 'system'}
          >
            Theme: System
          </Menu.Item>
          <Menu.Item
            className={styles.item}
            onSelect={() => setTheme('dark')}
            selected={currentTheme === 'dark'}
          >
            Theme: Dark
          </Menu.Item>
        </Menu.Content>
      </Menu>
    </div>
  );
}
