import { Request, Response } from "express";
import Joi from "joi";
import {
  createEvent,
  getEventById,
  getListOfEvents,
} from "../../services/event";
import mongoose from "mongoose";
import moment from "moment";

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

    const response = {
      id: eventId,
      name: event.name,
      dates: event.dates.map((aDate) => moment(aDate).format("YYYY-MM-DD")),
      votes: event.votes,
    };

    return res.send(response);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error occurred! Please try again." });
  }
}

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
