import * as jwt from "jsonwebtoken";

const createToken = (payload: object) => {
  return jwt.sign(
    {
      ...payload,
      iat: Math.floor(Date.now() / 1000)
    },
    process.env.JWT_SECRET || ""
  );
};
export default createToken;
