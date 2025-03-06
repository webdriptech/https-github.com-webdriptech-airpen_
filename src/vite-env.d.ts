/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;
  readonly VITE_CONVEX_URL: string;
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_ASSEMBLYAI_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
