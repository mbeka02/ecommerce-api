import { Router } from "express";
import { authenticateUser } from "../middleware/authentication.js";
import { authorizePermissions } from "../middleware/authentication.js";

import {
  getAllUsers,
  getSingleUser,
  updatePassword,
  updateUser,
  showCurentUser,
} from "../controllers/userController.js";

const router = Router();

router
  .route("/")
  .get(authenticateUser, authorizePermissions("admin"), getAllUsers);
router.route("/showUser").get(authenticateUser, showCurentUser);
router.route("/:id").get(authenticateUser, getSingleUser);
router.route("/updateAccountInfo/:id").patch(authenticateUser, updateUser);
router.route("/updatePassword/:id").patch(authenticateUser, updatePassword);

export default router;
