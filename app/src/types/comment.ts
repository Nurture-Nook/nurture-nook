export interface CommentCreate {
    content: string;
    warnings: number[];
    parent_comment_id: number | null;
    user_id: number;
    post_id: number;
}

export interface CommentOut {
    id: number;
    temporary_username: string;
    content: string;
    content_warnings: number[];
    replies: CommentOut[];
    parent_comment_id: number | null;
    post_id: number;
    created_at: string;
}
