import { inject, injectable } from "inversify";
import { User } from "../model/User";
import { PostRepository } from "../service/PostRepository";
import { UseCase } from "../UseCase";

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
@injectable()
export class UpdatePostLikes implements UseCase<Params, void> {
  /**
   * Create new instance of the use case
   */
  constructor(
    @inject(PostRepository) private readonly postRepository: PostRepository
  ) {}

  /**
   * Execute the use case
   */
  public async execute({ user, id, delta }: Params) {
    const post = await this.postRepository.getPost(id);

    await this.postRepository.updatePostLikes(user, post, delta);
  }
}
