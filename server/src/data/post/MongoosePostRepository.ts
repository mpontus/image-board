import { inject, injectable } from "inversify";
import { Model, Mongoose } from "mongoose";
import { User } from "../../domain/model/User";
import { PostRepository } from "../../domain/service/PostRepository";
import { Types } from "../../domain/Types";
import { PostSchema } from "./PostSchema";
import { PostDocument } from "./PostDocument";
import { PostDocumentMapper } from "./PostDocumentMapper";

@injectable()
export class MongoosePostRepository implements PostRepository {
  private readonly model: Model<PostDocument>;

  constructor(@inject(Types.Mongoose) private readonly db: Mongoose) {
    this.model = this.db.model("Post", PostSchema);
  }

  public getTotalPosts() {
    return this.model.countDocuments().exec();
  }

  public async getPosts(user: User, offset: number, limit: number) {
    const dataMapper = new PostDocumentMapper();
    const posts: PostDocument[] = await this.model
      .find({})
      .sort("-timestamp")
      .skip(offset)
      .limit(limit)
      .lean()
      .exec();

    return posts.map(post => dataMapper.transform(post));
  }

  public async getPost(id: string) {
    const dataMapper = new PostDocumentMapper();
    const post = await this.model.findById(id);

    if (post === null) {
      throw new Error(`Post with id: ${id} does not exist.`);
    }

    return dataMapper.transform(post);
  }

  public createPost() {
    return Promise.reject("not implemented");
  }

  public updatePostLikes() {
    return Promise.reject("not implemented");
  }

  public deletePost() {
    return Promise.reject("not implemented");
  }
}
