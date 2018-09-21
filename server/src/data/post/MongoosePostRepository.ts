import { inject, injectable } from "inversify";
import { Document, Model, Mongoose, Schema } from "mongoose";
import { Post } from "../../domain/model/Post";
import { User } from "../../domain/model/User";
import { PostRepository } from "../../domain/service/PostRepository";
import { Types } from "../../domain/Types";

interface PostEntity extends Document {
  imageId: string;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  author: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  likes: string[];
  likesCount: number;
  timestamp: number;
}

const postSchema: Schema = new Schema(
  {
    imageId: String,
    imageUrl: String,
    imageWidth: Number,
    imageHeight: Number,
    author: {
      id: String,
      name: String,
      avatarUrl: String
    },
    likes: [String],
    likesCount: Number
  },
  {
    timestamps: {
      createdAt: "timestamp"
    }
  }
);

@injectable()
export class MongoosePostRepository implements PostRepository {
  private readonly model: Model<PostEntity>;

  constructor(@inject(Types.Mongoose) private readonly db: Mongoose) {
    this.model = this.db.model<PostEntity>("Post", postSchema);
  }

  public getTotalPosts() {
    return Promise.resolve(1);
  }

  public async getPosts(user: User, offset: number, limit: number) {
    const total = await this.model.countDocuments().exec();
    const posts = await this.model
      .find({})
      .sort("-timestamp")
      .skip(offset)
      .limit(limit)
      .lean()
      .exec()
      .then(posts =>
        posts.map(
          (post: PostEntity): Post => ({
            id: post._id,
            image: {
              url: post.imageUrl,
              width: post.imageHeight,
              height: post.imageHeight,
              storageId: post.imageId
            },
            author: {
              id: post.author.id,
              username: post.author.name,
              avatarUrl: post.author.avatarUrl
            },
            likesCount: post.likesCount,
            likedBy: post.likes.reduce(
              (acc, id) => ({
                ...acc,
                [id]: true
              }),
              {}
            ),
            timestamp: new Date(post.timestamp).getTime()
          })
        )
      );

    return {
      total,
      items: posts
    };
  }

  public getPost() {
    return Promise.reject("not implemented");
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
