import path from "path";
import { fileURLToPath } from "url";
import type { NextConfig } from "next";

const appDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  ...(!process.env.VERCEL ? { turbopack: { root: appDir } } : {}),
};

export default nextConfig;
