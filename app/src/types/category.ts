export interface CategoryBadge {
    id: number
    title: string
}

export interface CategoryWithPosts {
    id: number;
    title: string;
    description: string;
    posts: number[];
}
