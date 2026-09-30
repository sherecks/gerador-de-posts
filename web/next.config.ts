import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Local-first tool: no remote image loader, no telemetry-bound features.
  reactStrictMode: true,
  /**
   * The dev server treats 127.0.0.1 as a foreign origin and blocks /_next/hmr
   * for it. The block is a warning in the terminal and total silence in the
   * browser: the page renders, client modules evaluate, and nothing ever
   * hydrates. Both spellings of the loopback are us.
   */
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
};

export default nextConfig;
