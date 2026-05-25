import { API_BASE_URL } from "@/src/config/env";
import { getCookie } from "@/src/utils/cookies";

export const getKnowledgeResources = async () => {
    try {
        const accessToken = getCookie("accessToken");

        const res = await fetch(`${API_BASE_URL}/knowledgeresource/api/knowledge-resources`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
            },
        });

        if (!res.ok) throw new Error("Failed to fetch knowledge resources");
        return res.json();
    } catch (error) {
        console.error("Error fetching knowledge resources:", error);
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