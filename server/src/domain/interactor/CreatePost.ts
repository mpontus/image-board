import { inject, injectable } from "inversify";
import { Post } from "../model/Post";
import { User } from "../model/User";
import { ImageStore } from "../service/ImageStore";
import { PostRepository } from "../service/PostRepository";
import { Types } from "../Types";
import { UseCase } from "../UseCase";

/**
 * Use case parameters
 */
interface Params {
  /**
   * User on whose behalf the post is created
   */
  user: User;

  /**
   * Post image
   */
  file: NodeJS.ReadableStream;
}

/**
 * Creates a new post authored by the user using uploaded file
 */
@injectable()
export class CreatePost implements UseCase<Params, Post> {
  /**
   * Create a new use case instance
   */
  constructor(
    @inject(Types.ImageStore) private readonly imageStore: ImageStore,
    @inject(Types.PostRepository)
    private readonly postRepository: PostRepository
  ) {}

  /**
   * Upload the picture and create a new posta
   */
  public async execute(params: Params) {
    const { user, file } = params;

    const image = await this.imageStore.save(file);

    return await this.postRepository.createPost(user, image);
  }
}
