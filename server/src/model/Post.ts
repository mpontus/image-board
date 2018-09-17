/**
 * Post Entity definition for Mongoose
 */
import { Document, Model, model, Schema } from "mongoose";

interface IPostEntity extends Document {
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

const PostEntity: Model<IPostEntity> = model("Post", postSchema);

export default PostEntity;
