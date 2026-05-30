export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.DEPLOY ||
    '';

export const AI_ASSISTANT_CACHE_KEY =
    'latee:practice:ai-assistant-sidebar:messages';

export const PATIENT_CHAT_AND_VALIDATION_CACHE_KEY =
    'latee:practice:patient-chat-and-validation';

export const env = {
    API_BASE_URL,
};