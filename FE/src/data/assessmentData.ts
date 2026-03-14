// src/data/assessmentData.ts
import { AssessmentData } from "@/src/types/assessment";

const MOCK_EXPERTS = [
    { name: "Dr. Jane Carter", role: "Specialist in Diagnostic Reasoning", img: "/images/d22.jpg" },
    { name: "Dr. Andrew Nguyen", role: "Clinical Instructor", img: "/images/doctorFEMALE.jpeg" }
];

export const MOCK_ASSESSMENTS: AssessmentData[] = [
    {
        id: "AS01",
        title: "Clinical Reasoning Practice: Diagnostic Thinking",
        subTitle: "Understanding Fluid Imbalance & Diagnostic Reasoning",
        description: "Explore how clinicians use structured diagnostic thinking to evaluate symptoms, identify chief concerns, analyze patient history, and generate differential diagnoses through interactive virtual scenarios.",
        img: "/images/quizz1.jpeg",
        level: 2,
        timeRequired: "45 minutes",
        deadline: "10/11/2025",
        releaseDate: "Oct 22, 2025",
        maxPracticed: 3,
        timesPracticed: 1,
        author: "Dr. Jane Carter",
        authorRole: "Specialist in Diagnostic Reasoning & Clinical Simulation",
        learningObjectives: [
            "Strengthen your clinical reasoning through realistic virtual patient cases.",
            "Practice diagnostic decision-making step by step with guided AI feedback.",
            "Develop your ability to analyze symptoms and interpret findings."
        ],
        experts: MOCK_EXPERTS
    }
];