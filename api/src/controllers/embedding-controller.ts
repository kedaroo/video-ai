import { Request, Response } from "express";
import { addItems, splitTextIntoChunks } from "../utils";
import { vdb } from "../config/vectra";

export const uploadChat = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const fileContent = req.file.buffer.toString("utf-8");

  const sourceDocChunks = splitTextIntoChunks(
    fileContent,
    1000,
    50000,
  );

  try {
    await addItems(sourceDocChunks, vdb)

    return res.status(200).json({ success: true });
  } catch (e) {
  return res
      .status(500)
      .json({ succes: false, message: "An internal server error occured" });
  }
};

