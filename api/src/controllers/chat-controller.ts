import { Request, Response } from "express";
import { askQuestion, getEmbedding } from "../utils";
import { vdb } from "../config/vectra";

export const chat = async (req: Request, res: Response) => {
  const { prompt } = req.body

  try {
    const embedding = (await getEmbedding(prompt))[0];

    const results = await vdb.queryItems(embedding, 10);

    const resulttext = results
      .map((r) => r.item.metadata.text)
      .join("\n\n---\n");


    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const answer = await askQuestion(prompt, resulttext);

    for await (const part of answer) {
      res.write(JSON.stringify(part.response));
    }

    res.end();
  } catch (e) {
    return res
      .status(500)
      .json({ succes: false, message: "An internal server error occured" });
  }
};

