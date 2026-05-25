import { getCookie } from "../utils/cookies";
import { API_BASE_URL } from '@/src/config/env';
import { RoadmapData } from "@/src/features/progress/roadmap";

export interface RoadmapItem {
    order_id: number;
    recommended_content: string;
    detailed_explain: string;
    amount_of_time_days: number;
    start_date: Date | null;
    status: "in_progress" | "done";
}

export interface GenerateRoadmapResponse {
    total_days: number;
    roadmap_title: string;
    goal: string;
    roadmap: RoadmapItem[];
}

export interface RoadmapResponse {
    roadmap_id: string;
    learner_id: string;
    content: GenerateRoadmapResponse;
    version: string;
    created_at: Date;
}

export default async function generateRoadmap(historyPractice: string, userTarget: string, totalDaysAvailable: number): Promise<RoadmapResponse | null> {
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

        const data: GenerateRoadmapResponse = await response.json();

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
                "content": data,
            })
        });

        if (!saveRoadmapResponse.ok) {
            const errorText = await saveRoadmapResponse.text();
            console.error(`Save Error: ${saveRoadmapResponse.status}`, errorText);
            throw new Error(`Failed to save roadmap: ${saveRoadmapResponse.status}`);
        }

        console.log("Save roadmap response:", saveRoadmapResponse);
        const saveRoadmapData: RoadmapResponse = await saveRoadmapResponse.json();
        return saveRoadmapData;
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
            // throw new Error(`Failed to fetch latest roadmap: ${response.status}`);
            return null;
        }

        const data: RoadmapResponse = await response.json();
        console.log("Latest roadmap response:", data);
        return data;
    } catch (error) {
        console.error("Error fetching latest roadmap:", error);
        return null;
    }
}

export async function updateRoadmapWithId(roadmapId: string, updatedRoadmapContent: RoadmapData) {
    try {
        const updatedContent = {
            "roadmap_title": updatedRoadmapContent.title,
            "goal": updatedRoadmapContent.goal,
            "total_days": updatedRoadmapContent.total_days,
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