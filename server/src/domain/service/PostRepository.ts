import { Image } from "@src/domain/model/Image";
import { Post } from "@src/domain/model/Post";
import { User } from "@src/domain/model/User";

/**
 * Manipulates image-board posts
 */
export abstract class PostRepository {
  /**
   * Returns the total number of posts visible to the user
   */
  public abstract getTotalPosts(): Promise<number>;

  /**
   * Returns slice of all posts as seen by the user
   */
  public abstract getPosts(
    user: User | undefined,
    offset: number,
    limit: number
  ): Promise<Post[]>;

  /**
   * Returns Post by its id
   */
  public abstract getPost(id: string): Promise<Post>;

  /**
   * Creates new post on behalf of the given user
   */
  public abstract createPost(user: User, image: Image): Promise<Post>;

  /**
   * Updates post likes count on behalf of the given user
   */
  public abstract updatePostLikes(
    user: User,
    post: Post,
    delta: number
  ): Promise<void>;

  /**
   * Deletes a post
   */
  public abstract deletePost(postId: Post): Promise<void>;
}
