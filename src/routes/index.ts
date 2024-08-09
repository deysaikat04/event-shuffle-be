import { Router } from "express";
import eventRouter from "./event";
import userRouter from "./user";
import { auth } from "../middleware/auth";

const router = Router();

router.use("/event", auth, eventRouter);
router.use("/user", userRouter);

export default router;
