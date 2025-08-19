export interface CommentCreate {
    content: string;
    warnings: number[];
    parent_comment_id: number | null;
    user_id: number;
    post_id: number;
}

export interface CommentOut {
    id: number;
    user_id: number;
    temporary_username: string;
    is_deleted: boolean;
    content: string;
    warnings: number[];
    replies: CommentOut[];
    parent_comment_id: number | null;
    post_id: number;
    created_at: string;
}
