import { Document } from "mongoose";

/**
 * Describes shape of the entity stored in the database
 */
export interface PostDocument extends Document {
  _id: string;
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
