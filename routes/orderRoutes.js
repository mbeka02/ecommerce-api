import { Router } from "express";
import {
  getAllOrders,
  getSingleOrder,
  createOrder,
  updateOrder,
  getCurrentUserOrders,
} from "../controllers/orderController.js";

import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authentication.js";

const router = Router();

router
  .route("/")
  .get(authenticateUser, authorizePermissions("admin"), getAllOrders)
  .post(authenticateUser, createOrder);

router.route("/myOrders").get(authenticateUser, getCurrentUserOrders);

router
  .route("/:id")
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder);

export default router;
