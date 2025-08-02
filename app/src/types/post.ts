export interface PostOut {
    id: number;
    title: string;
    content_warnings: number[];
    created_at: string;
}

export interface PostDetailedOut {
    id: number;
    title: string;
    description: string;
    temporary_username: string;
    categories: number[];
    content_warnings: number[];
    comments: number[];
    created_at: string;
}
