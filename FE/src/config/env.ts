export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.DEPLOY ||
    '';

export const AI_ASSISTANT_CACHE_KEY =
    'latee:practice:ai-assistant-sidebar:messages';

export const PATIENT_CHAT_AND_VALIDATION_CACHE_KEY = 'latee:practice:patient-chat-and-validation';

export const NGROK_SKIP_BROWSER_WARNING_HEADER = {
    'ngrok-skip-browser-warning': 'true',
} as const;

export const env = {
    API_BASE_URL,
};