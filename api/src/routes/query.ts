import express from "express";
import { query } from "../controllers/query";

const router = express.Router();

router.route("/chat").post(query);

export default router;