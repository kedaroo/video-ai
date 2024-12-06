import express from "express";
import { uploadVideo } from "../controllers/embedding";
import multer from "multer";
import path from "path";

const router = express.Router();

const videoPath = path.join(__dirname, '..', "controllers");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, videoPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); 
  },
});

const upload = multer({ storage });

router.route("/uploadVideo").post(upload.single("video"), uploadVideo);

export default router;
