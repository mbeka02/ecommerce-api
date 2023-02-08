import UnauthorizedError from "../errors/unauthorized.js";

const checkPermission = (reqUser, resourceUserId) => {
  if (reqUser.role === "admin") return;
  if (reqUser.userId === resourceUserId.toString()) return;
  throw new UnauthorizedError("You are not authorized to access this route");
};

export default checkPermission;
