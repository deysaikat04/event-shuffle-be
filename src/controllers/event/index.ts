import { Request, Response } from "express";
import Joi from "joi";
import mongoose from "mongoose";
import {
  createEvent,
  getEventById,
  getListOfEvents,
  addVote,
} from "../../services/event";
import { VoteBaseInterface } from "../../models/vote";
import { formatEventResponse } from "../../utils/formatEventResponse";
import { formatDate } from "../../utils/formatDate";

/**
 * Fetch an event by id
 * @param req
 * @param res
 * @returns
 */
export async function getAnEventHandler(req: Request, res: Response) {
  const eventIdSchema = Joi.object({
    eventId: Joi.string().required(),
  });

  const { value: eventIdData, error } = eventIdSchema.validate(req.params);

  if (error) {
    return res.status(400).json({
      message: error,
    });
  }

  try {
    const { eventId } = eventIdData;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        message: "Invalid event id",
      });
    }

    const event = await getEventById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "No event found with the given id",
      });
    }

    const formattedResponse = formatEventResponse(event);
    res.send({
      success: true,
      data: formattedResponse,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error occurred! Please try again." });
  }
}

/**
 * Create an event
 * @param req
 * @param res
 * @returns
 */
export async function createEventHandler(req: Request, res: Response) {
  const eventSchema = Joi.object({
    name: Joi.string().required(),
    dates: Joi.array().items(Joi.date()).required(),
  });

  const { value: eventData, error } = eventSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error?.message,
    });
  }

  try {
    const userId = res.locals.auth.user?.id;

    const datesVal = eventData.dates.some(
      (date: string) => new Date(date) < new Date()
    );

    if (datesVal) {
      return res.status(400).json({
        message: "Dates can not be past date",
      });
    }

    const event = await createEvent({ ...eventData, createdBy: userId });

    if (!event) {
      return res.status(400).json({
        message: "Failed to create an event.",
      });
    }

    return res.json({
      id: event._id,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error occurred! Please try again." });
  }
}

/**
 * Get list of events
 * @param req
 * @param res
 * @returns
 */
export async function getListOfEventsHandler(req: Request, res: Response) {
  try {
    const event = await getListOfEvents();

    const response = event.map((anEvent) => ({
      id: anEvent._id as string,
      name: anEvent.name,
    }));

    return res.send({
      events: [...response],
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error occurred! Please try again." });
  }
}

/**
 * Add vote to an event
 * @param req
 * @param res
 * @returns
 */
export async function addVoteToAnEventHandler(req: Request, res: Response) {
  // validate params
  const eventIdSchema = Joi.object({
    eventId: Joi.string().required(),
  });

  const { value: eventIdData, error: eventIdError } = eventIdSchema.validate(
    req.params
  );

  if (eventIdError) {
    return res.status(400).json({
      message: eventIdError,
    });
  }

  try {
    // check if event id exists
    const { eventId } = eventIdData;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        message: "Invalid event id",
      });
    }

    const event = await getEventById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "No event found with the given id",
      });
    }

    // validate payload
    const voteSchema = Joi.object({
      name: Joi.string().required(),
      votes: Joi.array().items(Joi.date()).min(1).required(),
    });

    const { value: voteData, error } = voteSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error?.message,
      });
    }

    let vote: VoteBaseInterface | null = null;
    let allVotes: VoteBaseInterface[] | null = [...event.votes];

    voteData.votes.forEach((date: Date) => {
      vote = event.votes.find(
        (v) => v.date.getTime() === date.getTime()
      ) as VoteBaseInterface;

      if (!vote) {
        const newVote: VoteBaseInterface = { date, people: [voteData.name] };
        allVotes.push(newVote);
        vote = newVote;
      }
      if (!vote.people.includes(voteData.name)) {
        vote.people.push(voteData.name);
      }
    });
    let updateData = await addVote(eventId, allVotes);

    if (updateData.modifiedCount === 1) {
      var data = await getEventById(eventId);
      const formattedResponse = formatEventResponse(data);
      res.send({
        success: true,
        data: formattedResponse,
      });
    } else {
      res.status(500).send("Server Error");
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error occurred! Please try again." });
  }
}

/**
 * Get suitable date by event id
 * @param req
 * @param res
 * @returns
 */
export async function getSuitableDateByEventIdHandler(
  req: Request,
  res: Response
) {
  const eventIdSchema = Joi.object({
    eventId: Joi.string().required(),
  });

  const { value: eventIdData, error } = eventIdSchema.validate(req.params);

  if (error) {
    return res.status(400).json({
      message: error,
    });
  }

  try {
    const { eventId } = eventIdData;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        message: "Invalid event id",
      });
    }
    const event = await getEventById(req.params.eventId);

    if (!event) return res.status(404).json({ error: "Event not found" });

    const suitableDates = event.votes
      .filter(
        (vote) =>
          vote.people.length ===
          event.votes.reduce((max, v) => Math.max(max, v.people.length), 0)
      )
      .map((aDate) => ({
        date: formatDate(aDate.date),
        people: aDate.people,
      }));

    res.json({
      id: eventId,
      name: event.name,
      suitableDates,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
