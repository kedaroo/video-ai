import { LocalIndex } from "vectra";

export const vdb = new LocalIndex(`./embeddings`)

export const initVectorIndex = async () => {
  if (!(await vdb.isIndexCreated())) {
    await vdb.createIndex();
  }
}
