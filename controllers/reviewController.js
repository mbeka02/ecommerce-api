import Review from "../models/Review.js";
import Product from "../models/Product.js";
import { StatusCodes } from "http-status-codes";
import NotFoundError from "../errors/not-found.js";
import BadRequestError from "../errors/bad-request.js";
import checkPermission from "../utilities/checkPermission.js";

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  req.body.user = req.user.userId;

  const validProduct = await Product.findOne({ _id: productId });

  if (!validProduct) {
    throw new NotFoundError(" Product does not exist");
  }

  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });

  if (alreadySubmitted) {
    throw new BadRequestError("Already submitted review for this product");
  }
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: "product",
    select: "name comapany price",
  });
  res.status(StatusCodes.OK).json({ reviews });
};

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new NotFoundError(
      "This review does not exist or might have been deleted"
    );
  }
  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;
  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new NotFoundError(
      "This review does not exist or might have been deleted"
    );
  }
  checkPermission(req.user, review.user);

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();

  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new NotFoundError(
      "This review does not exist or might have been deleted"
    );
  }
  checkPermission(req.user, review.user);

  await review.remove();
  res.status(StatusCodes.OK).json({ msg: "The review has been  deleted" });
};

export {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
