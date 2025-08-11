import type { CommentOut } from "@/types/comment";

export function insertComment(comments: CommentOut[], newComment: CommentOut): CommentOut[] {
    if (newComment.post_id !== (comments[0]?.post_id ?? newComment.post_id)) {
        return comments;
    }

    if (!newComment.parent_comment_id) {
        return [newComment, ...comments];
    }

    return comments.map(comment => {
        if (comment.id === newComment.parent_comment_id) {
            return {...comment, replies: insertComment(comment.replies || [], newComment)};
        }
        
        return {...comment, replies: insertComment(comment.replies || [], newComment)};
    });
}
