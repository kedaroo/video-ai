import { Request, Response } from "express";
import {
  extractFrames,
  getEmbedding,
  getImagesWithTimestamps,
} from "../utils";
import { vdb } from "../config/vectra";
import path from "path";
import fs from "fs";
import { ollama } from "../config/ollama-client";
import { VISION_MODEL } from "../constants";

export const uploadVideo = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const filePath = req.file.path;
    const outputDir: string = path.join(__dirname, "output_frames"); // Define where to save the extracted frames
    const jsonFilePath: string = path.join(outputDir, "timestamps.json"); // Path to the timestamps JSON file

    await extractFrames(filePath, outputDir, 100);

    const imagesWithTimestamps = getImagesWithTimestamps(
      outputDir,
      jsonFilePath
    );

    for (const img of imagesWithTimestamps) {
      const ollamaRes = await ollama.generate({
        model: VISION_MODEL,
        prompt: "Describe this image",
        images: [img.data],
      });

      const embedding = await getEmbedding(ollamaRes.response);

      await vdb.insertItem({
        vector: embedding[0],
        metadata: { text: img.timestamp },
      });
    }


    fs.rm(filePath, { recursive: true, force: true }, (err) => {
      if (err) {
        console.error('Error deleting directory:', err);
      } else {
        console.log('Directory deleted successfully');
      }
    });
    fs.rm(outputDir, { recursive: true, force: true }, (err) => {
      if (err) {
        console.error('Error deleting directory:', err);
      } else {
        console.log('Directory deleted successfully');
      }
    });

    return res.status(200).json({ success: true });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ succes: false, message: "An internal server error occured" });
  }
};
