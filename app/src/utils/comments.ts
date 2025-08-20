import type { CommentOut } from "@/types/comment";

/**
 * Build a comment tree from a flat array of comments.
 */
export function buildCommentTree(comments: CommentOut[]): CommentOut[] {
    const map = new Map<number, CommentOut>();
    const roots: CommentOut[] = [];

    // Initialize replies as empty arrays
    comments.forEach(comment => {
        map.set(comment.id, { ...comment, replies: [] });
    });

    comments.forEach(comment => {
        if (comment.parent_comment_id && map.has(comment.parent_comment_id)) {
            map.get(comment.parent_comment_id)!.replies.push(map.get(comment.id)!);
        } else {
            roots.push(map.get(comment.id)!);
        }
    });

    return roots;
}

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
