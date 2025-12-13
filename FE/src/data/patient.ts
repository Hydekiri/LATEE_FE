// src/data/mockData.ts
import { PatientData } from "@/src/types/practice";

const abdominalIssues = [
    "Acute appendicitis",
    "Gallbladder inflammation",
    "Irritable bowel syndrome (IBS)",
    "Peptic ulcer pain",
    "Acute pancreatitis",
    "Small bowel obstruction"
];

// Tạo dữ liệu tĩnh (Static Data) thay vì random mỗi lần render
export const MOCK_PATIENTS: PatientData[] = Array.from({ length: 9 }).map((_, i) => ({
    id: `PT00${i + 1}`,
    img: `/images/VirtualPatient/VP${i + 1}.jpeg`, // Đảm bảo bạn có ảnh VP1.jpeg -> VP9.jpeg
    level: "Level 1",
    time: "10 - 20 mins",
    occupation: i % 2 === 0 ? "Child" : "Old woman",
    description: "Clinically relevant. Real-world scenarios tailored for medical students.",
    chiefConcern: abdominalIssues[i % abdominalIssues.length], // Lấy tuần tự để cố định dữ liệu
    date: "Sep 20, 2023",
    feedback: 60 + i, // Fake số liệu cố định
}));

// Hàm helper để lấy bệnh nhân theo ID
export const getPatientById = (id: string): PatientData | undefined => {
    return MOCK_PATIENTS.find(p => p.id === id);
};