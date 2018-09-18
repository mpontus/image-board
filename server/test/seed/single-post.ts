import Post from "@src/model/Post";
import * as faker from "faker";

faker.seed(1);

export const postId = "43345823304969c878318d12";
export const authorId = faker.random.uuid();

export default async () => {
  faker.seed(1);

  await Post.create({
    _id: postId,
    imageId: faker.random.uuid(),
    imageUrl: faker.image.imageUrl(),
    imageWidth: faker.random.number(1000),
    imageHeight: faker.random.number(1000),
    author: {
      id: authorId,
      name: faker.internet.userName(),
      avatarUrl: faker.image.imageUrl()
    },
    likesCount: 0,
    likes: [],
    timestamp: faker.date.between("1980-01-01", "1990-01-01")
  });
};
