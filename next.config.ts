import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.NEXT_PUBLIC_GITHUB_PAGES === "true" ? {
    output: "export" as const,
    distDir: ".next-pages",
    basePath: "/the-wiz",
    trailingSlash: true,
  } : {}),
  reactStrictMode: true,
  poweredByHeader: false,
  // Pin the workspace root — other lockfiles higher up the tree confuse the
  // file-tracing heuristic.
  outputFileTracingRoot: path.resolve(process.cwd()),
  outputFileTracingExcludes: { '*': ['./.data/**', './Content/**', './preview-source/**', './.env*'] },
  images: {
    unoptimized: process.env.NEXT_PUBLIC_GITHUB_PAGES === "true",
    formats: ["image/avif", "image/webp"],
    // The shipped notebook placeholders are SVG. Drop in JPG/PNG later and
    // these two lines can go.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
