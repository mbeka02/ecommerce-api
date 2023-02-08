import { Schema, model } from "mongoose";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const { sign } = jsonwebtoken;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "provide a value"],
    trim: true,
    //maxlength: [20, "name is longer than 20 characters"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "please provide a valid email address"],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    ],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
    //maxlength: 15,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});
//hashing
UserSchema.pre("save", async function () {
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

//instance methods
UserSchema.methods.createJWT = function () {
  return sign({ name: this.name, userId: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

UserSchema.methods.comparePassword = async function (inputPassword) {
  const valid = await bcryptjs.compare(inputPassword, this.password);
  return valid;
};

export default model("User", UserSchema);
