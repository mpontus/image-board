import { User } from "@src/domain/model/User";
import { Image } from "@src/domain/model/Image";

/**
 * Describes a post on the image board
 */
export interface Post {
  /**
   * Unique string identifying this post
   */
  id: string;

  /**
   * Contains image details
   */
  image: Image;

  /**
   * Contains details about the post author
   */
  author: User;

  /**
   * Total number of users who liked the post
   */
  likesCount: number;

  /**
   * Contains ids of users who liked the post
   */
  likedBy: { [key: string]: true };

  /**
   * Timestamp of the post creation
   */
  timestamp: number;
}
