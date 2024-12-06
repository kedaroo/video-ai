import { Request, Response } from "express";
import { getEmbedding } from "../utils";
import { vdb } from "../config/vectra";

export const query = async (req: Request, res: Response) => {
  const { query } = req.query

  try {
    const embedding = (await getEmbedding(query as string))[0];

    const results = await vdb.queryItems(embedding, 10);

    console.log(results)

    res.json({ results });
  } catch (e) {
    return res
      .status(500)
      .json({ succes: false, message: "An internal server error occured" });
  }
};

