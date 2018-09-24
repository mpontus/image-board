import * as express from "express";
import { inject } from "inversify";
import {
  BaseHttpController,
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  queryParam,
  request,
  requestParam,
  response
} from "inversify-express-utils";
import * as multiparty from "multiparty";
import { Observable } from "rxjs";
import { filter, map, switchMap } from "rxjs/operators";
import { CreatePost } from "../domain/interactor/CreatePost";
import { DeletePost } from "../domain/interactor/DeletePost";
import { GetPosts } from "../domain/interactor/GetPosts";
import { UpdatePostLikes } from "../domain/interactor/UpdatePostLikes";
import { Post } from "../domain/model/Post";
import { User } from "../domain/model/User";

const serializePost = (user: User | undefined) => (post: Post): object => ({
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
  isLiked: user ? user.id in post.likedBy : false,
  timestamp: new Date(post.timestamp).toISOString()
});

@controller("/api/posts")
export class PostsController extends BaseHttpController {
  constructor(
    @inject(GetPosts) private readonly getPostsUseCase: GetPosts,
    @inject(CreatePost) private readonly createPostUseCase: CreatePost,
    @inject(DeletePost) private readonly deletePostUseCase: DeletePost,
    @inject(UpdatePostLikes)
    private readonly updatePostLikesUseCase: UpdatePostLikes
  ) {
    super();
  }

  @httpGet("/")
  public async index(@queryParam("page") page: number) {
    const { total, items } = await this.getPostsUseCase.execute({
      user: this.httpContext.user.details,
      limit: 10,
      offset: 10 * (Math.max(1, page) - 1)
    });

    return {
      total,
      items: items.map(serializePost(this.httpContext.user.details))
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
        map(serializePost(this.httpContext.user.details))
      )
      .toPromise();
  }

  @httpDelete("/:id")
  public async deletePost(@requestParam("id") id: string) {
    await this.deletePostUseCase.execute({
      user: this.httpContext.user.details,
      id
    });
  }

  @httpPut("/:id/like")
  public async likePost(@requestParam("id") id: string) {
    await this.updatePostLikesUseCase.execute({
      user: this.httpContext.user.details,
      id,
      delta: 1
    });
  }

  @httpDelete("/:id/like")
  public async dislikePost(@requestParam("id") id: string) {
    await this.updatePostLikesUseCase.execute({
      user: this.httpContext.user.details,
      id,
      delta: -1
    });
  }
}
