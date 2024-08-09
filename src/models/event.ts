import mongoose from "mongoose";
import { VoteInterface, voteSchema } from "./vote";
import { UserInterface } from "./user";

export interface EventBaseInterface {
  name: string;
  dates: Date[];
  votes: VoteInterface[];
  createdBy: UserInterface["_id"];
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
