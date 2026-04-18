/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WHATSAPP_CHANNEL_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
