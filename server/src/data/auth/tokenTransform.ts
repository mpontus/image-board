import * as t from "io-ts";
import { User } from "../../domain/model/User";

export const Payload = t.type({
  sub: t.string,
  name: t.string,
  picture: t.string
});

export const tokenTransform = (payload: any): User => {
  const result = Payload.decode(payload);

  if (result.isLeft()) {
    throw new Error("Invalid token payload");
  }

  const { sub, name, picture } = result.value;

  return {
    id: sub,
    username: name,
    avatarUrl: picture
  };
};
