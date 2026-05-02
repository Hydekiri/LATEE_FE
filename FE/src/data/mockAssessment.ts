import { AssessmentFullDetails } from "@/src/types/assessment";

export const MOCK_FULL_ASSESSMENT: AssessmentFullDetails = {
    assessmentId: "AS01",
    creatorId: "user-dev-01",
    title: "Clinical Reasoning Practice: Diagnostic Thinking",
    subTitle: "Domain 1: Cardiovascular & Respiratory",
    topic: "Internal Medicine",
    difficultyLevel: 'Intermediate',
    descriptions: "Evaluate your ability to differentiate common causes of chest pain and dyspnea.",
    specialty: "Cardiology",
    img: "/images/quizz1.jpeg", 
    
    goal: "Develop critical thinking and enhance diagnostic skills.",
    numQuestions: 2,
    timeLimitMinutes: 30,
    timesPracticed: 120,
    passingScorePercentage: 80,
    maxAttempts: 3,
    isActive: true,
    createdAt: "2026-05-01T08:00:00Z",
    deadline:  "2026-08-01T08:00:00Z",
    author: "Dr. Tan Dang",
    authorRole: "Senior Medical Educator",
    learningObjectives: [
        "Identify red flags in chest pain", 
        "Differentiate aortic dissection"
    ],
    experts: [],
    questions: [
        {
            questionId: "Q-001",
            assessmentId: "AS-2026-001",
            questionType: 'MultipleChoice',
            cognitiveLevel: 'Analyze',
            content: "A 65-year-old male presents with sudden chest pain radiating to the back, blood pressure difference between arms, and a widened mediastinum on X-ray. What is the most likely diagnosis?",
            options: [
                { id: "A", content: "Acute myocardial infarction" },
                { id: "B", content: "Pulmonary embolism" },
                { id: "C", content: "Aortic dissection" },
                { id: "D", content: "Pericarditis" }
            ],
            points: 1,
        },
        {
            questionId: "Q-002",
            assessmentId: "AS-2026-001",
            questionType: 'MultipleChoice',
            cognitiveLevel: 'Apply',
            content: "A 24-year-old female presents with fever, dysuria, flank pain, and costovertebral angle tenderness. What is the most likely diagnosis?",
            options: [
                { id: "A", content: "Acute cystitis" },
                { id: "B", content: "Kidney stone" },
                { id: "C", content: "Pyelonephritis" },
                { id: "D", content: "Pelvic inflammatory disease" }
            ],
            points: 1,
        },
        {
            questionId: "Q-003",
            assessmentId: "AS-2026-001",
            questionType: 'MultipleChoice',
            cognitiveLevel: 'Understand',
            content: "A patient presents with polyuria, polydipsia, and elevated blood glucose levels. What is the most likely diagnosis?",
            options: [
                { id: "A", content: "Diabetes mellitus" },
                { id: "B", content: "Diabetes insipidus" },
                { id: "C", content: "Hyperthyroidism" },
                { id: "D", content: "Cushing syndrome" }
            ],
            points: 1,
        },
        {
            questionId: "Q-004",
            assessmentId: "AS-2026-001",
            questionType: 'MultipleChoice',
            cognitiveLevel: 'Analyze',
            content: "A smoker presents with chronic cough, sputum production, and dyspnea. Which condition is most likely?",
            options: [
                { id: "A", content: "Asthma" },
                { id: "B", content: "Chronic bronchitis" },
                { id: "C", content: "Tuberculosis" },
                { id: "D", content: "Pneumonia" }
            ],
            points: 1,
        },
        {
            questionId: "Q-005",
            assessmentId: "AS-2026-001",
            questionType: 'MultipleChoice',
            cognitiveLevel: 'Apply',
            content: "A child presents with a barking cough and inspiratory stridor. What is the most likely diagnosis?",
            options: [
                { id: "A", content: "Asthma" },
                { id: "B", content: "Croup" },
                { id: "C", content: "Epiglottitis" },
                { id: "D", content: "Bronchiolitis" }
            ],
            points: 1,
        },
        {
            questionId: "Q-006",
            assessmentId: "AS-2026-001",
            questionType: 'MultipleChoice',
            cognitiveLevel: 'Analyze',
            content: "A patient presents with sudden onset shortness of breath and chest pain after a long flight. What is the most likely diagnosis?",
            options: [
                { id: "A", content: "Pulmonary embolism" },
                { id: "B", content: "Myocardial infarction" },
                { id: "C", content: "Pneumothorax" },
                { id: "D", content: "Pneumonia" }
            ],
            points: 1,
        },
        {
            questionId: "Q-007",
            assessmentId: "AS-2026-001",
            questionType: 'MultipleChoice',
            cognitiveLevel: 'Understand',
            content: "Which condition is characterized by joint pain and morning stiffness lasting more than one hour?",
            options: [
                { id: "A", content: "Osteoarthritis" },
                { id: "B", content: "Rheumatoid arthritis" },
                { id: "C", content: "Gout" },
                { id: "D", content: "Septic arthritis" }
            ],
            points: 1,
        },
        {
            questionId: "Q-008",
            assessmentId: "AS-2026-001",
            questionType: 'MultipleChoice',
            cognitiveLevel: 'Apply',
            content: "A patient presents with jaundice, dark urine, and pale stools. What is the most likely diagnosis?",
            options: [
                { id: "A", content: "Hemolytic anemia" },
                { id: "B", content: "Hepatitis" },
                { id: "C", content: "Gallstones causing obstruction" },
                { id: "D", content: "Pancreatitis" }
            ],
            points: 1,
        },
        {
            questionId: "Q-009",
            assessmentId: "AS-2026-001",
            questionType: 'MultipleChoice',
            cognitiveLevel: 'Analyze',
            content: "A patient with history of alcohol abuse presents with epigastric pain radiating to the back. What is the most likely diagnosis?",
            options: [
                { id: "A", content: "Gastritis" },
                { id: "B", content: "Pancreatitis" },
                { id: "C", content: "Peptic ulcer disease" },
                { id: "D", content: "Cholecystitis" }
            ],
            points: 1,
        },
        {
            questionId: "Q-010",
            assessmentId: "AS-2026-001",
            questionType: 'MultipleChoice',
            cognitiveLevel: 'Apply',
            content: "A patient presents with tremor, weight loss, and heat intolerance. What is the most likely diagnosis?",
            options: [
                { id: "A", content: "Hypothyroidism" },
                { id: "B", content: "Hyperthyroidism" },
                { id: "C", content: "Cushing syndrome" },
                { id: "D", content: "Addison disease" }
            ],
            points: 1,
        }
    ]
};