import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {
    root: projectRoot,
  },
  async redirects() {
    return [
      {
        source: "/marketing/:path+",
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
