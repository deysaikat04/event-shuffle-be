import mongoose from "mongoose";
import { VoteInterface, voteSchema } from "./vote";

export interface EventBaseInterface {
  name: string;
  dates: Date[];
  votes: VoteInterface[];
}

export interface EventInterface extends EventBaseInterface, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    dates: [
      {
        type: Date,
        required: true,
      },
    ],
    votes: {
      type: [voteSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model<EventInterface>("Event", eventSchema);

export default Event;
