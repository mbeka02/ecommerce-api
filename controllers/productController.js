import Product from "../models/Product.js";
import { StatusCodes } from "http-status-codes";
import NotFoundError from "../errors/not-found.js";

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({});

  res.status(StatusCodes.OK).json({ products, count: products.length });
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId }).populate("reviews");

  if (!product) {
    throw new NotFoundError("Product does not exist");
  }

  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findByIdAndUpdate(
    { _id: productId },
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );

  if (!product) {
    throw new NotFoundError("Product does not exist");
  }

  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new NotFoundError("Product does not exist");
  }
  await product.remove();
  res.status(StatusCodes.OK).json({ msg: "Item has been deleted" });
};

const uploadImage = async (req, res) => {};

export {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  getSingleProduct,
  uploadImage,
};
