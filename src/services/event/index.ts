import Event, { EventInterface } from "../../models/event";

export async function getEventById(eventId: string) {
  try {
    const result = await Event.findById(
      {
        _id: eventId,
      },
      {
        _id: 0,
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

export async function createEvent(event: Partial<EventInterface>) {
  try {
    const result = await Event.create(event);
    return result;
  } catch (e) {
    throw e;
  }
}
