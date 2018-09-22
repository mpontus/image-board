import { Post } from "../../domain/model/Post";
import { DataMapper } from "../DataMapper";
import { PostDocument } from "./PostDocument";

export class PostDocumentMapper implements DataMapper<PostDocument, Post> {
  public transform(post: PostDocument) {
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
