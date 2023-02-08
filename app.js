//console.log('E-Commerce API');
import express, { json } from "express";
import "express-async-errors";

import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimiter from "express-rate-limit";
import morgan from "morgan";
import xss from "xss-clean";
import cors from "cors";
import ExpressMongoSanitize from "express-mongo-sanitize";

dotenv.config();

//routes
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import orderRouter from "./routes/orderRoutes.js";

//middleware
import notFound from "./middleware/not-found.js";
import errorHandler from "./middleware/errorHandler.js";

//DB
import connectDB from "./db/connect.js";

const app = express();

/*app.get("/", (req, res) => {
  res.send("E-Commerce API");
});*/
app.set("trust proxy", 1);

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 100,
    max: 60,
  })
);

app.use(helmet());
app.use(cors());
app.use(xss());
app.use(ExpressMongoSanitize());

app.use(json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

// handle non-existing routes
app.use(notFound);
//custom error handler
app.use(errorHandler);

const port = 3000 || process.env.PORT;

const startServer = async () => {
  try {
    await connectDB(process.env.DEVDB);
    app.listen(port, () => {
      console.log(`Server is listening on port :${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
