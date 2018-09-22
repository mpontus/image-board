import * as express from "express";
import { inject } from "inversify";
import {
  controller,
  httpGet,
  httpPost,
  response,
  BaseHttpController
} from "inversify-express-utils";
import { Types } from "../domain/Types";
import { Post } from "../domain/model/Post";
import { GetPosts } from "../domain/interactor/GetPosts";

const serializePost = (post: Post): object => ({
  id: post.id,
  imageUrl: post.image.url,
  imageWidth: post.image.width,
  imageHeight: post.image.height,
  author: {
    id: post.author.id,
    name: post.author.username,
    avatarUrl: post.author.avatarUrl
  },
  likes: post.likesCount,
  // TODO: this is wrong
  isLiked: false,
  timestamp: new Date(post.timestamp).toISOString()
});

@controller("/api/posts")
export class PostsController extends BaseHttpController {
  constructor(
    @inject(Types.GetPosts) private readonly getPostsUseCase: GetPosts
  ) {
    super();
  }

  @httpGet("/")
  public async index() {
    const { total, items } = await this.getPostsUseCase.execute({
      user: this.httpContext.user.details,
      limit: 10,
      offset: 0
    });

    return {
      total,
      items: items.map(serializePost)
    };
  }

  @httpPost("/")
  public async createPost(@response() res: express.Response) {
    return "foo";
    // await this.createPostUseCase.execute({
    //   id: "123",
    //   username: "foo",
    //   avatarUrl: "http://example.org/picture.jpg"
    // });
  }
}
