export interface PostDetailedOut {
    id: Number;
    title: string;
    description: string;
    temporary_username: string;
    categories: number[];
    content_warnings: number[];
    comments: number[];
    created_at: string;
}
