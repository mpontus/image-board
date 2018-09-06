import { User } from "./User";

export interface Picture {
  url: string;
  width: number;
  height: number;
}

export interface Post {
  id: string;
  picture: Picture;
  author: User;
  likesCount: number;
  isLiked: boolean;
  timestamp: number;
}
