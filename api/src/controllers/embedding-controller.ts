import { Request, Response } from "express";
import {
  addItems,
  extractFrames,
  getImagesWithTimestamps,
  splitTextIntoChunks,
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

    await extractFrames(filePath, outputDir, 10);

    const imagesWithTimestamps = getImagesWithTimestamps(
      outputDir,
      jsonFilePath
    );

    const ollamaRes = await ollama.generate({
      model: VISION_MODEL,
      prompt: 'Describe this image',
      images: [imagesWithTimestamps[1].data],
    })

    // const response = await ollama.chat({
    //   model: VISION_MODEL,
    //   messages: [{
    //     role: 'user',
    //     content: 'What is in this image?',
    //     images: [imagesWithTimestamps[0].data]
    //   }]
    // })

    console.log(ollamaRes);

    return res.status(200).json({ success: true });
  } catch (e) {
    console.log(e)
    return res
      .status(500)
      .json({ succes: false, message: "An internal server error occured" });
  }
};
