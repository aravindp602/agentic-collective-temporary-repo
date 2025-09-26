// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // This is the definitive fix for the "workspace root" warning.
  // It explicitly tells the Next.js server where your project is,
  // removing all ambiguity that was causing Prisma to fail.
  experimental: {
    outputFileTracingRoot: "/Users/aravindp/Documents/personal_project/akkuettan_project/agentic-collective",
  },
};

export default nextConfig;