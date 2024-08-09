import mongoose, { Schema, Document } from "mongoose";

// Interfaces
export interface VoteBaseInterface {
  date: Date;
  people: string[];
}

export const voteSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  people: [{ type: String }],
});

const Vote = mongoose.model<VoteBaseInterface>("Vote", voteSchema);

export default Vote;
