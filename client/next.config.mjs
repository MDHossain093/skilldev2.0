/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: process.env.NODE_ENV === "production",
};

export default nextConfig;
