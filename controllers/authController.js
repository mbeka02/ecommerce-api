import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/bad-request.js";
import UnauthenticatedError from "../errors/unauthenticated.js";
import UnauthorizedError from "../errors/unauthorized.js";
//import { BadRequestError, UnauthenticatedError } from "../errors/index.js";
import { createJWT, attachCookies } from "../utilities/jwt.js";
import createTokenUser from "../utilities/createTokenUser.js";
//import { attachCookies } from "../utilities/jwt.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const emailExists = await User.findOne({ email: email });

  if (emailExists) {
    throw new BadRequestError("This email is already in use");
  }

  const isAdmin = (await User.countDocuments({})) === 0;

  const role = isAdmin ? "admin" : "user";

  const user = await User.create({ name, email, password, role });
  const tokenUser = createTokenUser(user);
  attachCookies({ res, user: tokenUser });
  // res.status(201).json({ msg: req.body });
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
  //console.log(error);

  //res.json({ msg: error });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError(
      "Ensure that you have filled in the email and password correctly"
    );
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    throw new UnauthenticatedError("Invalid email");
  }

  const validPassword = await user.comparePassword(password);
  if (!validPassword) {
    throw new UnauthorizedError("Invalid password");
  }

  const tokenUser = createTokenUser(user);
  attachCookies({ res, user: tokenUser });
  // res.status(201).json({ msg: req.body });
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
  //console.log(error);
};

const logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({ msg: "User has logged out" });
};

export { register, login, logout };
