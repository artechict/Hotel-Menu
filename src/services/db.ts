import { createClient } from "@libsql/client";

const client = createClient({
  url: (import.meta as any).env.VITE_TURSO_URL || "",
  authToken: (import.meta as any).env.VITE_TURSO_TOKEN || "",
});

export const db = client;
