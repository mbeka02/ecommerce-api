import Order from "../models/Order.js";
import NotFoundError from "../errors/not-found.js";
import BadRequestError from "../errors/bad-request.js";
import { StatusCodes } from "http-status-codes";
import checkPermission from "../utilities/checkPermission.js";
import Product from "../models/Product.js";

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = "someRandomValue";
  return { client_secret, amount };
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders });
};

const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;

  const order = await Order.findOne({ _id: orderId });

  if (!order) {
    throw new NotFoundError(`Order ${orderId} does not exist`);
  }

  checkPermission(req.user, order.user);

  res.status(StatusCodes.OK).json({ order });
};

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;

  if (!cartItems || cartItems.length < 1) {
    throw new BadRequestError("No cart items provided");
  }
  if (!tax || !shippingFee) {
    throw new BadRequestError("Please provide tax and shipping fee");
  }

  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });

    if (!dbProduct) {
      throw new NotFoundError(
        "This item does not exist or is unavailable at the moment"
      );
    }
    const { name, price, image, _id } = dbProduct;
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };
    orderItems = [singleOrderItem, ...orderItems];
    subtotal += item.amount * price;
  }

  const total = tax + shippingFee + subtotal;

  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "ksh",
  });

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });

  res.status(StatusCodes.CREATED).json({ order, secret: order.clientSecret });
};

const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentInfo } = req.body;

  const order = await Order.findOne({ _id: orderId });

  if (!order) {
    throw new NotFoundError(`Order ${orderId} does not exist`);
  }

  checkPermission(req.user, order.user);

  order.paymentInfo = paymentInfo;
  order.status = "paid";

  await order.save();

  res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
  const order = await Order.find({ user: req.user.userId });

  res.status(StatusCodes.OK).json({ order });
};

export {
  getAllOrders,
  getSingleOrder,
  createOrder,
  updateOrder,
  getCurrentUserOrders,
};
