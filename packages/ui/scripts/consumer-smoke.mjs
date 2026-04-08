import { execFileSync } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const run = (command, args, cwd, env) => {
  execFileSync(command, args, {
    cwd,
    env,
    stdio: 'inherit',
  });
};

const runCapture = (command, args, cwd, env) =>
  execFileSync(command, args, {
    cwd,
    env,
    stdio: ['ignore', 'pipe', 'inherit'],
    encoding: 'utf8',
  }).trim();

const smokeTsx = `import React, { useState } from 'react';
import '@kagu-project/8bit-ui/style.css';
import {
  AssetCard,
  Button,
  Menu,
  Modal,
  ToastProvider,
  useToast,
  type ButtonProps,
  type MenuItemProps,
} from '@kagu-project/8bit-ui';

const typedButtonProps: ButtonProps = {
  variant: 'outline',
  color: 'secondary',
  children: 'Typed Button',
};

const typedMenuItemProps: MenuItemProps = {
  children: 'Rename',
  onSelect: () => {},
  danger: false,
};

const AssetActions = () => (
  <Menu>
    <Menu.Trigger ariaLabel="Open asset actions">...</Menu.Trigger>
    <Menu.Content align="end">
      <Menu.Item {...typedMenuItemProps} />
      <Menu.Item onSelect={() => {}}>Duplicate</Menu.Item>
      <Menu.Separator />
      <Menu.Item danger onSelect={() => {}}>
        Delete
      </Menu.Item>
    </Menu.Content>
  </Menu>
);

const ToastActions = () => {
  const toast = useToast();
  return (
    <Button {...typedButtonProps} onClick={() => toast.success('Saved')}>
      Save
    </Button>
  );
};

const ModalExample = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <Modal.Header title="Confirm Action" onClose={onClose} />
    <Modal.Body>Proceed with action?</Modal.Body>
    <Modal.Footer>
      <Button variant="link" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="solid" color="primary" onClick={onClose}>
        Confirm
      </Button>
    </Modal.Footer>
  </Modal>
);

const ConsumerSmokeApp = () => {
  const [open, setOpen] = useState(false);

  return (
    <ToastProvider>
      <AssetCard
        title="Asset_001.png"
        subtitle="124 KB"
        src="https://placehold.co/400x300/111/fff?text=IMG_1"
        actions={<AssetActions />}
      />
      <ToastActions />
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <ModalExample isOpen={open} onClose={() => setOpen(false)} />
    </ToastProvider>
  );
};

void ConsumerSmokeApp;
`;

const smokePackageJson = `{
  "name": "consumer-smoke",
  "private": true,
  "type": "module"
}
`;

const smokeTsconfig = `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["./smoke.tsx"]
}
`;

let smokeDir = '';
let tarballPath = '';
let npmHomeDir = '';

try {
  npmHomeDir = await mkdtemp(join(rootDir, '.consumer-npm-home-'));
  const npmEnv = {
    ...process.env,
    HOME: npmHomeDir,
    npm_config_cache: join(npmHomeDir, '.npm-cache'),
  };

  const tarballName = runCapture('npm', ['pack', '--silent'], rootDir, npmEnv).split('\n').pop();
  if (!tarballName) {
    throw new Error('Failed to create npm package tarball.');
  }

  tarballPath = join(rootDir, tarballName);
  smokeDir = await mkdtemp(join(rootDir, '.consumer-smoke-'));

  await writeFile(join(smokeDir, 'package.json'), smokePackageJson, 'utf8');
  await writeFile(join(smokeDir, 'tsconfig.json'), smokeTsconfig, 'utf8');
  await writeFile(join(smokeDir, 'smoke.tsx'), smokeTsx, 'utf8');

  run(
    'npm',
    ['install', '--legacy-peer-deps', '--no-audit', '--no-fund', '--silent', tarballPath],
    smokeDir,
    npmEnv,
  );
  run(
    join(rootDir, 'node_modules/.bin/tsc'),
    ['--noEmit', '-p', 'tsconfig.json'],
    smokeDir,
    process.env,
  );
} finally {
  if (smokeDir) {
    await rm(smokeDir, { recursive: true, force: true });
  }
  if (tarballPath) {
    await rm(tarballPath, { force: true });
  }
  if (npmHomeDir) {
    await rm(npmHomeDir, { recursive: true, force: true });
  }
}
