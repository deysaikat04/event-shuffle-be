import { Router } from "express";
import {
  createEventHandler,
  getAnEventHandler,
  getListOfEventsHandler,
} from "../../controllers/event";

const router = Router();

router.get("/list", getListOfEventsHandler);
router.get("/:eventId", getAnEventHandler);
router.post("/", createEventHandler);

export default router;
