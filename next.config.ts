import type { NextConfig } from "next";

// Use standalone output so Azure App Service can run the bundled Node server directly.
const nextConfig: NextConfig = {
  output: "standalone"
};

export default nextConfig;
