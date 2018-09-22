import { PostDocument } from "./PostDocument";
import { DataMapper } from "../DataMapper";
import { Post } from "../../domain/model/Post";

export class PostDocumentMapper implements DataMapper<PostDocument, Post> {
  transform(post: PostDocument) {
    return {
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
    };
  }
}
