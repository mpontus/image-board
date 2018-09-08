import { User } from "./User";

export interface Picture {
  url: string;
  width: number;
  height: number;
}

export interface Progress {
  bytesTransferred: number;
  bytesTotal: number;
}

export interface Post {
  _model: void;
  id: string;
  picture: Picture;
  author: User;
  likesCount: number;
  isLiked: boolean;
  timestamp: number;
  pending: boolean;
  progress: Progress | null;
}
