import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const { sign, verify } = jwt;

const createJWT = ({ payload }) => {
  const token = sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });

  return token;
};

const verifyToken = ({ token }) => verify(token, process.env.JWT_SECRET);

const attachCookies = ({ res, user }) => {
  const token = createJWT({ payload: user });

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

export { createJWT, verifyToken, attachCookies };
