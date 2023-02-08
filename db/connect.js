import mongoose from "mongoose";

const connectDB = (url) => {
  return mongoose.set("strictQuery", false).connect(url, {
    // useNewUrlParser: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
  });
  //.then(console.log("...connection established"));
};

export default connectDB;
