import mongoose, { Schema, model } from "mongoose";

const ReviewSchema = new Schema(
  {
    rating: {
      type: Number,
      required: [true, "please provide a review rating"],
      min: 0,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
      required: [true, "provide a review title "],
    },
    comment: {
      type: String,
      trim: true,
      required: [true, "provide a review comment "],
      maxlength: [1000, "Review comment cannot be longe than 1000 characters"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.statics.calculateAverageRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },

    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);
  try {
    await this.model("Product").findOneAndUpdate(
      { _id: productId },
      {
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        reviewCount: result[0]?.reviewCount || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

ReviewSchema.post("save", async function () {
  await this.constructor.calculateAverageRating(this.product);
});

ReviewSchema.post("remove", async function () {
  await this.constructor.calculateAverageRating(this.product);
});

export default model("Review", ReviewSchema);
