import { inject, injectable } from "inversify";
import { Model, Mongoose } from "mongoose";
import { Image } from "../../domain/model/Image";
import { Post } from "../../domain/model/Post";
import { User } from "../../domain/model/User";
import { PostRepository } from "../../domain/service/PostRepository";
import { Types } from "../../domain/Types";
import { PostDocument } from "./PostDocument";
import { PostDocumentMapper } from "./PostDocumentMapper";
import { PostSchema } from "./PostSchema";

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

  public async createPost(user: User, image: Image) {
    const dataMapper = new PostDocumentMapper();
    const post: PostDocument = await this.model.create({
      imageId: image.storageId,
      imageUrl: image.url,
      imageWidth: image.width,
      imageHeight: image.height,
      author: {
        id: user.id,
        name: user.username,
        avatarUrl: user.avatarUrl
      },
      likes: [user.id],
      likesCount: 1
    });

    return dataMapper.transform(post);
  }

  public async updatePostLikes(user: User, post: Post, delta: 1 | -1) {
    const [conditions, doc] =
      delta > 0
        ? [
            { _id: post.id, likes: { $ne: user.id } },
            { $inc: { likesCount: 1 }, $push: { likes: user.id } }
          ]
        : [
            { _id: post.id, likes: user.id },
            { $inc: { likesCount: -1 }, $pull: { likes: user.id } }
          ];
    const { nModified } = await this.model.updateOne(conditions, doc).exec();

    if (nModified === 0) {
      throw new Error("Post likes could not be changed");
    }
  }

  public async deletePost(post: Post) {
    await this.model.findByIdAndDelete(post.id);
  }
}
