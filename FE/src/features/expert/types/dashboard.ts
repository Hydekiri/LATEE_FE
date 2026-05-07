export type ItemType = 'Practice' | 'Assessment';
export type IssueStatus = 'Open' | 'In Review' | 'Reviewed';

export interface LearnerLog {
    name: string;
    email: string;
    lastPractice: string;
    evalScore: number;
    entrustment: string;
    roadmap: string;
    risk: 'Low' | 'Medium' | 'High';
}

export interface IssueItem {
    id: string;
    user: string;
    itemType: ItemType;
    contextId: string;
    content: string;
    status: IssueStatus;
    date: string;
    isPublic: boolean;
    expertReply: string | null;
}