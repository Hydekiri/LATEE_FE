import { API_BASE_URL } from "@/src/config/env";
import { getCookie } from "@/src/utils/cookies";
import { NGROK_SKIP_BROWSER_WARNING_HEADER } from "@/src/utils/api-client";

export const getKnowledgeResources = async () => {
    try {
        const accessToken = getCookie("accessToken");

        const res = await fetch(`${API_BASE_URL}/knowledgeresource/api/knowledge-resources`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                ...NGROK_SKIP_BROWSER_WARNING_HEADER,
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
            },
        });

        if (!res.ok) throw new Error("Failed to fetch knowledge resources");
        return res.json();
    } catch (error) {
        console.error("Error fetching knowledge resources:");
        console.error(error);

        if (error instanceof Error) {
            console.error("Message:", error.message);
            console.error("Stack:", error.stack);
        }

        throw error;
    }
};

export const getKnowledgeResourceById = async (id: string) => {
    try {
        const accessToken = getCookie("accessToken");

        const res = await fetch(`${API_BASE_URL}/knowledgeresource/api/knowledge-resources/${id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                ...NGROK_SKIP_BROWSER_WARNING_HEADER,
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
            },
        });
        console.log("Fetch response:", res);

        if (!res.ok) throw new Error("Failed to fetch knowledge resource");
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching knowledge resource:", error);
        throw error;
    }
};