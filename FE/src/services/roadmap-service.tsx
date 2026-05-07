import { getCookie } from "../utils/cookies";
import { API_BASE_URL } from '@/src/config/env';

export default async function generateRoadmap(historyPractice: string, userTarget: string, totalDaysAvailable: number) {
    try {
        const accessToken = getCookie("accessToken");

        const response = await fetch(`${API_BASE_URL}/roadmap/api/roadmap/generate-roadmap`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
            },
            body: JSON.stringify({
                "historyPractice": historyPractice,
                "userTarget": userTarget,
                "totalDaysAvailable": totalDaysAvailable
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API Error: ${response.status}`, errorText);
            throw new Error(`Failed to generate roadmap: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.goal === "Unable to generate roadmap") {
            alert("Sorry, we couldn't generate a roadmap based on the information provided. Please try adjusting your inputs and try again.");
            return null;
        }

        /*
         * CALL API FOR SAVING ROADMAP TO DB
         */
        const userId = getCookie("userId");

        const saveRoadmapResponse = await fetch(`${API_BASE_URL}/roadmap/api/roadmap`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
            },
            body: JSON.stringify({
                "learner_id": userId,
                "content": data
            })
        });

        if (!saveRoadmapResponse.ok) {
            const errorText = await saveRoadmapResponse.text();
            console.error(`Save Error: ${saveRoadmapResponse.status}`, errorText);
            throw new Error(`Failed to save roadmap: ${saveRoadmapResponse.status}`);
        }

        console.log("Save roadmap response:", saveRoadmapResponse);
        const saveRoadmapData = await saveRoadmapResponse.json();
        return saveRoadmapResponse.ok ? saveRoadmapData : null;
    } catch (error) {
        console.error("Error generating roadmap:", error);
        throw error;
    }

}

export async function getLatestRoadmap() {
    try {
        const accessToken = getCookie("accessToken");
        const userId = getCookie("userId");
        const response = await fetch(`${API_BASE_URL}/roadmap/api/roadmap/latest/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Fetch Latest Roadmap Error: ${response.status}`, errorText);
            throw new Error(`Failed to fetch latest roadmap: ${response.status}`);
        }

        const data = await response.json();
        console.log("Latest roadmap response:", data);
        return data;
    } catch (error) {
        console.error("Error fetching latest roadmap:", error);
        throw error;
    }
}

export async function updateRoadmapWithId(roadmapId: string, updatedRoadmapContent: any) {
    try {
        const updatedContent = {
            "roadmap_title": updatedRoadmapContent.title,
            "goal": updatedRoadmapContent.goal,
            "roadmap": updatedRoadmapContent.roadmap
        }

        const accessToken = getCookie("accessToken");
        const response = await fetch(`${API_BASE_URL}/roadmap/api/roadmap/${roadmapId}/content`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
            },
            body: JSON.stringify({
                "content": updatedContent
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Update Roadmap Error: ${response.status}`, errorText);
            throw new Error(`Failed to update roadmap: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating roadmap:", error);
        throw error;
    }
}