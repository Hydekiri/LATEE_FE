import { PatientData } from "@/src/types/practice";

const MOCK_EXPERTS = [
    { name: "Dr. Andrew Nguyen", role: "Specialist in Diagnostic Reasoning", img: "/images/experts/expert1.jpg" },
    { name: "Dr. Tachibana Keji", role: "Clinical Instructor", img: "/images/experts/expert2.jpg" },
];

export const MOCK_PATIENTS: PatientData[] = Array.from({ length: 9 }).map((_, i) => ({
    id: `02511${i + 2}`,
    caseId: `#TH18${72 + i}`,
    img: `/images/VirtualPatient/VP${i + 1}.jpeg`, 
    name: "Abigail Park",
    age: 52,
    gender: "Female",
    pronouns: "She/Her",
    ethnicity: "Kinh",
    setting: "Clinical Reasoning Lab",
    level: "Level 1",
    time: "30/15 minutes",
    occupation: "Teacher",
    description: "A 52-year-old female teacher comes to the clinic for evaluation of a recent health concern.",
    chiefConcern: "Leg swelling",
    date: "Sep 20, 2023",
    feedback: 60 + i,
    timesPracticed: 2,
    vitalSigns: {
        bp: "120/70",
        hr: 88,
        spo2: 98,
        rr: 18,
        temp: "37°C"
    },
    instructions: {
        role: "You are a medical learner practicing your clinical reasoning skills.",
        task: "You have been assigned to evaluate this patient and identify possible diagnoses.",
        procedure: [
            "Enter the virtual consultation room.",
            "Use the chat to interact with the patient.",
            "Apply your reasoning to analyze symptoms."
        ]
    },
    caseRules: {
        rules: ["Chief Concern", "History of Present Illness", "Diagnostic Impression"],
        totalTime: "45 minutes",
        timeBreakdown: ["30 minutes interaction", "15 minutes reasoning"]
    },
    learningObjectives: [
        "Strengthen clinical reasoning.",
        "Practice diagnostic decision-making.",
        "Analyze symptoms and interpret findings."
    ],
    experts: MOCK_EXPERTS
}));