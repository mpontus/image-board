import * as express from "express";
import { inject } from "inversify";
import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
  request,
  response
} from "inversify-express-utils";
import * as multiparty from "multiparty";
import { Observable } from "rxjs";
import { filter, map, switchMap } from "rxjs/operators";
import { CreatePost } from "../domain/interactor/CreatePost";
import { GetPosts } from "../domain/interactor/GetPosts";
import { Post } from "../domain/model/Post";
import { Types } from "../domain/Types";

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
    @inject(Types.GetPosts) private readonly getPostsUseCase: GetPosts,
    @inject(Types.CreatePost) private readonly createPostUseCase: CreatePost
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
  public createPost(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const part$ = new Observable<multiparty.Part>(observer => {
      const form = new multiparty.Form();

      form.on("part", (part: multiparty.Part) => {
        observer.next(part);
      });

      form.on("error", (error: Error) => observer.error("error"));

      form.on("close", () => observer.complete());

      form.parse(req);

      return () => form.removeAllListeners();
    });

    return part$
      .pipe(
        filter(part => part.name === "file"),
        switchMap(file =>
          this.createPostUseCase.execute({
            user: this.httpContext.user.details,
            file
          })
        ),
        map(serializePost)
      )
      .toPromise();
  }
}
