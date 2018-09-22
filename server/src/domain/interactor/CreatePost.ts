import { Post } from "@src/domain/model/Post";
import { User } from "@src/domain/model/User";
import { ImageStore } from "@src/domain/service/ImageStore";
import { PostRepository } from "@src/domain/service/PostRepository";
import { UseCase } from "@src/domain/UseCase";

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
export class CreatePost implements UseCase<Params, Post> {
  /**
   * Create a new use case instance
   */
  constructor(
    private readonly imageStore: ImageStore,
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
