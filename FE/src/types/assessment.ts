// Định nghĩa cấu trúc dữ liệu riêng cho Assessment
export interface Expert {
    name: string;
    role: string;
    img: string;
}
export interface AssessmentData {
    id: string;
    title: string;
    subTitle: string;
    description: string;
    img: string;
    level: number | string;
    timeRequired: string; // ví dụ: "45 minutes"
    deadline: string;     // ví dụ: "10/11/2025"
    releaseDate: string;  // ví dụ: "Oct 22, 2025"
    maxPracticed: number; // Số lần tối đa được làm
    timesPracticed: number;
    author: string;
    authorRole: string;
    learningObjectives: string[];
    experts: Expert[];
}