import { Router } from "express";
import {
  addVoteToAnEventHandler,
  createEventHandler,
  getAnEventHandler,
  getListOfEventsHandler,
  getSuitableDateByEventIdHandler,
} from "../../controllers/event";

const router = Router();

router.post("/", createEventHandler);
router.get("/list", getListOfEventsHandler);
router.get("/:eventId", getAnEventHandler);
router.post("/:eventId/vote", addVoteToAnEventHandler);
router.get("/:eventId/results", getSuitableDateByEventIdHandler);

export default router;
