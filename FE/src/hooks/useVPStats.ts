import { useEffect, useState } from "react";
import { virtualPatientExpertService } from "@/src/services/virtual-patient-expert-service";

interface VPStats {
    active: number;
    published: number;
    archived: number;
    avgScore: number | null;
    statsLoading: boolean;
}

export function useVPStats(): VPStats {
    const [active, setActive] = useState(0);
    const [published, setPublished] = useState(0);
    const [archived, setArchived] = useState(0);
    const [avgScore, setAvgScore] = useState<number | null>(null);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        virtualPatientExpertService
            .list({ pageSize: 200 })
            .then((res) => {
                const items = res.items;

                setActive(items.filter((p) => p.status === "active").length);
                setPublished(items.filter((p) => p.status === "published").length);
                setArchived(items.filter((p) => p.status === "archived").length);
                const scores = items
                    .map((p) => p.avgScore)
                    .filter((s): s is number => s !== null && s !== undefined);

                setAvgScore(
                    scores.length > 0
                        ? scores.reduce((a, b) => a + b, 0) / scores.length
                        : null
                );
            })
            .catch(console.error)
            .finally(() => setStatsLoading(false));
    }, []);

    return { active, published, archived, avgScore, statsLoading };
}