import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const loadedEnv = loadEnv(mode, process.cwd(), "VITE_");
  const defineEnv: Record<string, string> = {};

  for (const [key, value] of Object.entries(loadedEnv)) {
    defineEnv[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  return {
    define: defineEnv,
    plugins: [
      tanstackStart(),
      nitro({ preset: "vercel" }),
      react(),
      tailwindcss(),
      tsconfigPaths({ projects: ["./tsconfig.json"] }),
    ],
    resolve: {
      alias: {
        "@": `${process.cwd()}/src`,
      },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    server: {
      host: "::",
      port: 8080,
    },
  };
});
