import { Post as ApiPost } from "../api";
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

export interface PostData {
  id: string;
  picture: Picture;
  author: User;
  likesCount: number;
  isLiked: boolean;
  timestamp: number;
}

export interface Post extends PostData {
  pending: boolean;
  progress: Progress | undefined;
}

export const mapResponseToPostData = (post: ApiPost): PostData => ({
  id: post.id,
  author: post.author,
  picture: {
    url: post.imageUrl,
    width: post.imageWidth,
    height: post.imageHeight
  },
  isLiked: post.isLiked,
  likesCount: post.likes,
  timestamp: post.timestamp.getTime()
});

export const denormalizePost = (
  data: PostData,
  pending: boolean,
  progress?: Progress
): Post => ({
  ...data,
  pending,
  progress
});
