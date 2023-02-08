import User from "../models/User.js";
import BadRequestError from "../errors/bad-request.js";
import UnauthenticatedError from "../errors/unauthenticated.js";
import notFound from "../errors/not-found.js";
import createTokenUser from "../utilities/createTokenUser.js";
import checkPermission from "../utilities/checkPermission.js";
import { attachCookies } from "../utilities/jwt.js";

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");

  res.status(200).json({ msg: users });
};

const getSingleUser = async (req, res) => {
  const { id: userId } = req.params;

  const user = await User.findOne({ _id: userId }).select("-password");

  if (!user) {
    throw new notFound("User does not exist");
  }
  checkPermission(req.user, user._id);
  res.status(200).json({ msg: user });
};

const showCurentUser = async (req, res) => {
  res.status(200).json({ user: req.user });
};

const updateUser = async (req, res) => {
  const { id: userId } = req.params;
  const { email, name } = req.body;
  /* const user = await User.findByIdAndUpdate({ _id: userId }, req.body, {
    runValidators: true,
    new: true,
  });*/
  if (!email || !name) {
    throw new BadRequestError("Ensure that both fields have been filled");
  }
  const user = await User.findOne({ _id: userId });

  /* if (!user) {
    throw new notFound("User does not exist");
  }*/
  user.email = email;
  user.name = name;

  await user.save();

  const tokenUser = createTokenUser(user);
  attachCookies({ res, user: tokenUser });

  res.status(200).json({ user: tokenUser });
};

const updatePassword = async (req, res) => {
  const { id: userId } = req.params;
  const { oldPassword, newPassword } = req.body;
  const user = await User.findOne({ _id: userId });

  if (!oldPassword || !newPassword) {
    throw new BadRequestError("Fields cannot be empty");
  }

  const validPassword = await user.comparePassword(oldPassword);

  if (!validPassword) {
    throw new UnauthenticatedError(
      "The password that you have entered is incorrect"
    );
  }

  user.password = newPassword;
  await user.save();
  res.status(200).json({ msg: "The password has been successfully changed" });
};

export {
  getAllUsers,
  getSingleUser,
  updatePassword,
  updateUser,
  showCurentUser,
};
