import path from "node:path";
import { fileURLToPath } from "node:url";

import { config } from "@loadforge/config";
import { defineConfig } from "prisma/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  migrations: { path: path.join(__dirname, "prisma", "migrations") },
  datasource: {
    url: config.DATABASE_URL,
  },
});
