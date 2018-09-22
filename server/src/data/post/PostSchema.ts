import { Schema } from "mongoose";

/**
 * Describes storage schema for Post entity in MongoDB
 */
export const PostSchema: Schema = new Schema(
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
