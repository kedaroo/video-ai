import express from "express";
import { chat } from "../controllers/chat-controller";

const router = express.Router();

router.route("/chat").post(chat);

export default router;