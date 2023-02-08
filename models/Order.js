import mongoose, { Schema, model } from "mongoose";

const singleOrderItemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "product",
    required: true,
  },
});

const OrderSchema = new Schema(
  {
    tax: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    orderItems: [singleOrderItemSchema],
    status: { type: String },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "failed", "paid", "delivered", "canceled"],
      default: "pending",
    },
    clientSecret: { type: String, required: true },
    paymentInfo: { type: String },
  },
  { timestamps: true }
);

export default model("Order", OrderSchema);
