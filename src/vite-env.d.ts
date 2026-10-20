/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SHEETS_URL?: string;
  readonly VITE_SPREADSHEET_URL?: string;
  readonly VITE_SHEETS_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
