import { EmbedRequest } from "ollama";
import { ollama } from "./config/ollama-client";
import { EMBEDDING_MODEL, QUERY_MODEL } from "./constants";
import { LocalIndex } from "vectra";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";

export const getEmbedding = async (input: EmbedRequest["input"]) => {
  const output = await ollama.embed({ model: EMBEDDING_MODEL, input });
  return output.embeddings;
};

// not needed
export const askQuestion = async (question: string, relatedtext: string) => {
  let prompt = question;

  if (relatedtext.length > 0) {
    prompt = `${question} The following is chat between residents of a housing society. Use only the information in the following text to answer the question: ${relatedtext}`;
  }

  const output = await ollama.generate({
    model: QUERY_MODEL,
    prompt: prompt,
    options: { num_ctx: 8192 },
    stream: true,
  });

  return output;
};

// not needed
export const splitTextIntoChunks = (
  text: string,
  chunkSize = 500,
  limit = 50000
): string[] => {
  const limitedText = text.slice(0, limit);
  const chunks: string[] = [];
  let index = 0;
  while (index < limitedText.length) {
    let endIndex = Math.min(index + chunkSize, limitedText.length);
    if (endIndex < limitedText.length) {
      const lastSpace = limitedText.lastIndexOf(" ", endIndex);
      if (lastSpace > index) {
        endIndex = lastSpace;
      }
    }

    chunks.push(limitedText.slice(index, endIndex).trim());
    index = endIndex + 1;
  }

  return chunks;
};

export const addItems = async (text: string[], vdb: LocalIndex) => {
  const embeddings = await getEmbedding(text);

  for (const [index, e] of embeddings.entries()) {
    await vdb.insertItem({
      vector: e,
      metadata: { text: text[index] },
    });
  }
};

// Ensure that the output directory exists
const ensureDirectoryExistence = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Function to get video duration using ffprobe
const getVideoDuration = (videoPath: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        const duration = metadata.format.duration!; // Duration in seconds
        resolve(duration);
      }
    });
  });
};

// Function to extract frames every 10 seconds
export async function extractFrames(
  videoPath: string,
  outputDir: string,
  interval: number
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const durationInSeconds = await getVideoDuration(videoPath);
      console.log(`Video Duration: ${durationInSeconds} seconds`);
  
      ensureDirectoryExistence(outputDir);
  
      const timestamps: { frame: string; timestamp: number }[] = [];
      let frameIndex = 0;
      const totalFrames = Math.floor(durationInSeconds / interval); // Calculate total frames to extract
  
      // Capture frames every 10 seconds
      const captureFrame = (frameNum: number) => {
        const timestamp = frameNum * interval; // Calculate timestamp
        const frameFileName = `frame-${String(frameIndex).padStart(4, "0")}.png`;
  
        ffmpeg(videoPath)
          .screenshots({
            timestamps: [timestamp], // Timestamp for the screenshot
            filename: frameFileName,
            folder: outputDir,
            // size: "320x240", // Adjust the size as needed
          })
          .on("end", () => {
            console.log(
              `Captured ${frameFileName} at timestamp ${timestamp.toFixed(
                2
              )} seconds`
            );
            timestamps.push({ frame: frameFileName, timestamp });
  
            frameIndex++;
            if (frameIndex < totalFrames) {
              captureFrame(frameIndex); // Capture the next frame
            } else {
              // Save timestamps to a file
              const timestampFile = path.join(outputDir, "timestamps.json");
              fs.writeFileSync(
                timestampFile,
                JSON.stringify(timestamps, null, 2)
              );
              console.log("Timestamps saved:", timestampFile);
              resolve();
            }
          })
          .on("error", (err: Error) => {
            console.error("Error capturing frame:", err.message);
            reject(err);
          });
      };
  
      // Start capturing frames from the first timestamp
      captureFrame(frameIndex);
    } catch (err) {
      console.error("Failed to extract frames:", err);
    }
  })
  
}

// // Adjust the path to point one level up from the dist directory
// const videoPath: string = path.join(__dirname, "..", "my-video.mp4"); // Adjust the video file path as needed
// const outputDir: string = path.join(__dirname, "output_frames"); // Define where to save the extracted frames

// Function to read timestamps from the JSON file
const readTimestamps = (
  jsonFilePath: string
): { frame: string; timestamp: number }[] => {
  const jsonData = fs.readFileSync(jsonFilePath, "utf-8");
  return JSON.parse(jsonData);
};

// Function to read an image file and convert it to a Base64 string
const readImageAsBase64 = (imagePath: string): string => {
  const imageBuffer = fs.readFileSync(imagePath);
  return imageBuffer.toString("base64");
};

// Function to list images in the output directory and get corresponding timestamps
export const getImagesWithTimestamps = (outputDir: string, jsonFilePath: string) => {
  const timestamps = readTimestamps(jsonFilePath);
  const imagesWithTimestamps: {
    image: string;
    timestamp: number;
    data: string;
  }[] = [];

  // Read all files in the output directory
  const files = fs.readdirSync(outputDir);

  files.forEach((file) => {
    const filePath = path.join(outputDir, file);
    const fileStat = fs.statSync(filePath);

    // Check if the file is an image (you can add more extensions if needed)
    if (fileStat.isFile() && /\.(png|jpg|jpeg|gif)$/i.test(file)) {
      const matchingTimestamp = timestamps.find((ts) => ts.frame === file);
      if (matchingTimestamp) {
        const imageData = readImageAsBase64(filePath); // Read the image as Base64
        imagesWithTimestamps.push({
          image: file,
          timestamp: matchingTimestamp.timestamp,
          data: imageData,
        });
      }
    }
  });

  return imagesWithTimestamps;
};

// // Specify the output directory and the path to the JSON file
// const outputDir: string = path.join(__dirname, "output_frames"); // Adjust this as needed
// const jsonFilePath: string = path.join(outputDir, "timestamps.json"); // Path to the timestamps JSON file

// // Get images with their corresponding timestamps
// const imagesWithTimestamps = getImagesWithTimestamps(outputDir, jsonFilePath);

// // Output the results
// console.log("Images with Timestamps:");
// imagesWithTimestamps.forEach((item) => {
//   console.log(
//     `Image: ${item.image}, Timestamp: ${item.timestamp.toFixed(
//       2
//     )} seconds, Data length: ${item.data.length} characters`
//   );
// });
