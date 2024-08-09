import { Router } from "express";
import {
  addVoteToAnEventHandler,
  createEventHandler,
  getAnEventHandler,
  getListOfEventsHandler,
} from "../../controllers/event";

const router = Router();

router.post("/", createEventHandler);
router.get("/list", getListOfEventsHandler);
router.get("/:eventId", getAnEventHandler);
router.post("/:eventId/vote", addVoteToAnEventHandler);

export default router;
