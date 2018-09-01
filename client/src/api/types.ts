export interface Post {
  id: string;
  picture: {
    url: string;
    width: number;
    height: number;
  };
  author: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  likesCount: number;
  isLiked: boolean;
  timestamp: number;
}

export interface PageResponse {
  total: number;
  items: Post[];
}
