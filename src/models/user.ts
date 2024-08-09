import mongoose from "mongoose";

export interface UserBaseInterface {
  email: string;
  name: string;
  password: string;
}

export interface UserInterface extends UserBaseInterface, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<UserInterface>("User", userSchema);

export default User;
