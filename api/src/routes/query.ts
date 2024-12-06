import express from "express";
import { query } from "../controllers/query";

const router = express.Router();

router.route("/query").get(query);

export default router;