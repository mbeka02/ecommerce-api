//import { required } from "joi";
import mongoose, { Schema, model, mongo } from "mongoose";

const ProductsSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "provide a name"],
      maxlength: [100, "Name can not be more than 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide product price"],
      default: 0,
    },
    description: {
      type: String,
      required: [true, "provide a description of the product"],
      maxlength: [1500, "Description can not be more than 1500 characters"],
    },
    image: {
      type: String,
      //default: '/uploads/example.jpeg',
    },
    category: {
      type: String,
      required: [true, "provide a product category"],
      enum: ["office", "kitchen", "bedroom"],
    },
    company: {
      type: String,
      required: [true, "provide a company"],
      enum: {
        values: ["ikea", "liddy", "marcos"],
        message: "{VALUE} is not supported",
      },
    },
    colors: {
      type: [String],
      default: ["#222"],
      required: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },
    averageRating: {
      type: Number,
      default: 0,
    },

    freeShipping: { type: Boolean, default: false },
    inventory: {
      type: Number,
      required: true,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ProductsSchema.virtual("reviews", {
  ref: "Review",
  justOne: false,
  localField: "_id",
  foreignField: "product",
});

// deletes all reviews associated with the product
ProductsSchema.pre("remove", async function (next) {
  await this.model("Review").deleteMany({ product: this._id });
});

export default model("Product", ProductsSchema);
