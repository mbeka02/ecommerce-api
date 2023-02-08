import { Router } from "express";

import {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  uploadImage,
  deleteProduct,
} from "../controllers/productController.js";

import {
  authorizePermissions,
  authenticateUser,
} from "../middleware/authentication.js";

const router = Router();

router
  .route("/")
  .get(getAllProducts)
  .post(authenticateUser, authorizePermissions("admin"), createProduct);
router
  .route("/:id")
  .get(getSingleProduct)
  .patch(authenticateUser, authorizePermissions("admin"), updateProduct)
  .delete(authenticateUser, authorizePermissions("admin"), deleteProduct);
router
  .route("/uploadImage/:id")
  .post(authenticateUser, authorizePermissions("admin"), uploadImage);

export default router;
