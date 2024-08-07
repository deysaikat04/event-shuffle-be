import mongoose, { Schema, Document } from "mongoose";

export interface VoteInterface extends Document {
  date: string;
  people: string[];
}

export const voteSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  people: [
    {
      type: String,
      required: true,
    },
  ],
});

const Vote = mongoose.model<VoteInterface>("Vote", voteSchema);

export default Vote;
