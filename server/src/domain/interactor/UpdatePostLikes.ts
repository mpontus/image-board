import { User } from "@src/domain/model/User";
import { PostRepository } from "@src/domain/service/PostRepository";
import { UseCase } from "@src/domain/UseCase";

/**
 * Use case params
 */
export interface Params {
  /**
   * Specifies the user casting the vote
   */
  user: User;

  /**
   * Specifies the id of the post being voted on
   */
  id: string;

  /**
   * Specifies the vote detla: 1 for like, -1 for unlike
   */
  delta: 1 | -1;
}

/**
 * Like or unlike the post on behalf of the given user
 */
export class UpdatePostLikes implements UseCase<Params, void> {
  /**
   * Create new instance of the use case
   */
  constructor(private readonly postRepository: PostRepository) {}

  /**
   * Execute the use case
   */
  public async execute({ user, id, delta }: Params) {
    const post = await this.postRepository.getPost(id);

    await this.postRepository.updatePostLikes(user, post, delta);
  }
}
