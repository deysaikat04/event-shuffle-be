import Event, { EventInterface } from "../../models/event";
import { VoteBaseInterface } from "../../models/vote";

export async function getEventById(eventId: string) {
  try {
    const result = await Event.findById(
      {
        _id: eventId,
      },
      {
        _id: 1,
        name: 1,
        dates: 1,
        votes: 1,
      }
    );
    return result;
  } catch (e) {
    throw e;
  }
}
export async function getListOfEvents() {
  try {
    const result = await Event.find(
      {},
      {
        _id: 1,
        name: 1,
      }
    );
    return result;
  } catch (e) {
    throw e;
  }
}

export async function createEvent(event: Partial<EventInterface>) {
  try {
    const result = await Event.create(event);
    return result;
  } catch (e) {
    throw e;
  }
}

export async function addVote(eventId: string, vote: VoteBaseInterface[]) {
  let data = await Event.updateOne(
    { _id: eventId },
    {
      votes: vote,
    }
  );
  return data;
}
