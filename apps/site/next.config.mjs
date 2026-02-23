import path from 'node:path';
import { fileURLToPath } from 'node:url';

const siteDir = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  transpilePackages: ['@kagu-project/8bit-ui'],
  turbopack: {
    root: path.resolve(siteDir, '..', '..'),
  },
};

export default nextConfig;
