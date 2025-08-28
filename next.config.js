/** @type {import('next').NextConfig} */
const isStaticExport = process.env.NEXT_STATIC_EXPORT === 'true';

/**
 * When NEXT_STATIC_EXPORT=true, we build a fully static site (no API routes),
 * matching the previous behavior. Otherwise (default), we enable API routes.
 */
const nextConfig = {
  ...(isStaticExport ? { output: 'export', images: { unoptimized: true } } : {}),
  eslint: { ignoreDuringBuilds: true },
};

module.exports = nextConfig;
