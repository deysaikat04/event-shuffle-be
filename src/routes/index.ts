import { Router } from "express";
import eventRouter from "./event";
import userRouter from "./user";

const router = Router();

router.use("/event", eventRouter);
router.use("/user", userRouter);

export default router;
