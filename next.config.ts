/** @type {import('next').NextConfig} */
const nextConfig = {
  // Config options
  redirects: async () => [
    {
      source: "/",
      destination: "/dashboard",
      permanent: true,
    },
  ],
};

export default nextConfig;
