export interface UserOut {
    id: number;
    role: string;
    created_at: string;
}

export interface UserPrivate extends UserOut {
    username: string;
    email: string;
}

export interface UserContent extends UserPrivate {
    posts: number[]
    comments: number[]
}