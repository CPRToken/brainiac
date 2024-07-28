
export interface Profile {

    uid?: string;
    avatar?: string;
    cover?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    userUrl?: string;
    role?: string;
  plan?: string;
  priceId?: string;
  stripeCustomerId?: string;
}



export interface Post {


        id: string;
    postId: string;
        avatar: string;
        name: string;
        comments: Comment[];
    createdAt: number;
    isLiked: boolean;
    likes: number;
    media?: string;
    message: string;
}





export interface Comment {
    id: string;
    postId: string;
        avatar: string;
        name: string;
      createdAt: number;
    message: string;
}



