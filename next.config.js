// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tell Vercel/Next to bundle the WASM file alongside server functions
  outputFileTracingIncludes: {
    '/**/*': [
      './node_modules/sql.js/dist/sql-wasm.wasm',
      './data/reviews.db',
    ],
  },
  // Keep sql.js as a server-external package so it's not bundled by Webpack
  serverExternalPackages: ['sql.js'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('sql.js');
    }
    return config;
  },
};

module.exports = nextConfig;
