import mongoose, { Schema, Document } from "mongoose";
import { UserInterface } from "./user";

export interface VoteInterface extends Document {
  date: string;
  people: Array<UserInterface["_id"]>;
}

export const voteSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  people: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Vote = mongoose.model<VoteInterface>("Vote", voteSchema);

export default Vote;
