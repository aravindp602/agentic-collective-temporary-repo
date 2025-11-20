// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // We are keeping this configuration minimal.
  // The 'webpack' block has been removed as it was not effective and the
  // 'use client' directive is the correct solution for the pptxgenjs issue.

  // The 'outputFileTracingRoot' key has also been removed to resolve the
  // warning in your build logs.

  // If you have any other specific Next.js configurations in the future
  // (like redirects, rewrites, or image domains), they will go inside this object.
};

export default nextConfig;