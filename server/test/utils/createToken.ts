import * as jwt from "jsonwebtoken";

const createToken = (payload: object = {}) => {
  return jwt.sign(
    {
      iat: Math.floor(Date.now() / 1000),
      sub: "123",
      ...payload
    },
    process.env.JWT_SECRET || ""
  );
};
export default createToken;
