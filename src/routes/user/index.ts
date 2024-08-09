import { Router } from "express";
import { registerUserHandler } from "../../controllers/user";

const router = Router();

router.post("/register", registerUserHandler);

export default router;
