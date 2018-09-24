import { inject, injectable } from "inversify";
import { Post } from "../model/Post";
import { User } from "../model/User";
import { PostRepository } from "../service/PostRepository";
import { UseCase } from "../UseCase";

/**
 * Use case parameters
 */
interface Params {
  /**
   * User on whose behalf the post is being deleted
   */
  user: User;

  /**
   * Post ID
   */
  id: string;
}

/**
 * Deletes existing post belonging to the user
 */
@injectable()
export class DeletePost implements UseCase<Params, void> {
  /**
   * Create a new use case instance
   */
  constructor(
    @inject(PostRepository) private readonly postRepository: PostRepository
  ) {}

  /**
   * Delete a post if the user is authorized to do so
   */
  public async execute({ user, id }: Params) {
    const post: Post = await this.postRepository.getPost(id);

    if (post.author.id !== user.id) {
      throw new Error("User does not own the post");
    }

    await this.postRepository.deletePost(post);
  }
}
