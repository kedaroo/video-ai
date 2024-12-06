import express from "express";
import { uploadChat } from "../controllers/embedding-controller";
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route("/uploadChat").post(upload.single("file"), uploadChat);

export default router;