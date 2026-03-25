import withPWAInit from "next-pwa";
import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
});

const nextConfig = {
  turbopack: {}, // ✅ MUST be object (not false)
};

export default withPWA(nextConfig);



