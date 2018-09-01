import { User } from "./User";

interface Picture {
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
