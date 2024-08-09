import { EventInterface } from "../models/event";
import { formatDate } from "./formatDate";

export const formatEventResponse = (event: EventInterface | null) => {
  return {
    name: event?.name,
    dates: event?.dates.map((aDate) => formatDate(aDate)),
    votes: event?.votes.map((aVote) => {
      return {
        date: formatDate(aVote.date),
        people: aVote.people,
      };
    }),
  };
};
