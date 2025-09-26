// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // This is the corrected configuration, moved out of the 'experimental' block.
  // This directly addresses the warning in your server logs.
  outputFileTracingRoot: "/Users/aravindp/Documents/personal_project/akkuettan_project/agentic-collective",
};

export default nextConfig;