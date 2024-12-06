import express from "express";
import cors from "cors";
import morgan from "morgan";
import chatRouter from './routes/query'
import embeddingRouter from './routes/embedding'

const app = express();
 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

// app.use("/api/v1", chatRouter);
app.use("/api/v1", embeddingRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "hello world!" });
});

export { app };