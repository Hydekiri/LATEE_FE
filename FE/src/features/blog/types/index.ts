export interface BlogPost {
    id: number;
    title: string;
    authors: string;
    date: string;
    image: string;
    category: string;
}

export interface BlogCategory {
    name: string;
    active?: boolean;
}