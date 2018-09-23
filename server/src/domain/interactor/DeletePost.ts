import { Post } from "@src/domain/model/Post";
import { User } from "@src/domain/model/User";
import { PostRepository } from "@src/domain/service/PostRepository";
import { UseCase } from "@src/domain/UseCase";
import { inject, injectable } from "inversify";
import { Types } from "../Types";

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
    @inject(Types.PostRepository)
    private readonly postRepository: PostRepository
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
