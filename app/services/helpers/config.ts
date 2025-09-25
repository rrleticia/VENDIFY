const env: any = (import.meta as any).env;
export const API_URL = env?.VITE_API_URL || "http://localhost:3000/api";
export const USE_CORREIOS = Boolean(env?.VITE_USE_CORREIOS);
