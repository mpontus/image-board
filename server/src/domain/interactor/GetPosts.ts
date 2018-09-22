import { inject, injectable } from "inversify";
import { Page } from "../model/Page";
import { Post } from "../model/Post";
import { User } from "../model/User";
import { PostRepository } from "../service/PostRepository";
import { Types } from "../Types";
import { UseCase } from "../UseCase";

/**
 * Use case parameters
 */
export interface Params {
  /**
   * Specifies authenticated user making the request
   */
  user?: User;

  /**
   * Specifies the number of posts to skip
   */
  offset: number;

  /**
   * Specifies the maximum number of posts to return
   */
  limit: number;
}

/**
 * Retrieve frontpage posts as paginated response
 */
@injectable()
export class GetPosts implements UseCase<Params, Page<Post>> {
  /**
   * Create new instance of the use case
   */
  constructor(
    @inject(Types.PostRepository)
    private readonly postRepository: PostRepository
  ) {}

  /**
   * Execute the use case
   */
  public async execute({ user, limit, offset }: Params) {
    const total = await this.postRepository.getTotalPosts();
    const posts = await this.postRepository.getPosts(user, offset, limit);

    return {
      total,
      items: posts
    };
  }
}
