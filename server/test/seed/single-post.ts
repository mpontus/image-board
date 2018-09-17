import * as faker from "faker";
import Post from "@src/model/Post";

const seed = () => {
  faker.seed(1);

  return Post.create({
    _id: "43345823304969c878318d12",
    imageId: faker.random.uuid(),
    imageUrl: faker.image.imageUrl(),
    imageWidth: faker.random.number(1000),
    imageHeight: faker.random.number(1000),
    author: {
      id: faker.random.uuid(),
      name: faker.internet.userName(),
      avatarUrl: faker.image.imageUrl()
    },
    likesCount: 0,
    likes: [],
    timestamp: faker.date.between("1980-01-01", "1990-01-01")
  });
};

export default seed;
