import * as env from "dotenv";
env.config();

import { app } from './app' 
import { initVectorIndex } from "./config/vectra";

const PORT = process.env.PORT || 5000;

const init = async () => {
  await initVectorIndex()
  app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
}

init()

