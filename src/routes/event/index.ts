import { Router } from "express";
import { createEventHandler, getAnEvent } from "../../controllers/event";

const router = Router();

router.get("/:eventId", getAnEvent);
router.post("/", createEventHandler);

export default router;
