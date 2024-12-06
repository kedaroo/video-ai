import { EmbedRequest } from "ollama";
import { ollama } from "./config/ollama-client";
import { EMBEDDING_MODEL, QUERY_MODEL } from "./constants";
import { LocalIndex } from "vectra";

export const getEmbedding = async (input: EmbedRequest['input']) => {
  const output = await ollama.embed({ model: EMBEDDING_MODEL, input });
	return output.embeddings;
}

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
}

export const splitTextIntoChunks = (
	text: string,
	chunkSize = 500,
	limit = 50000,
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
}

export const addItems = async (text: string[], vdb: LocalIndex) => {
  const t0 = performance.now();
	const embeddings = await getEmbedding(text);
	const embedtime = performance.now() - t0;

	for (const [index, e] of embeddings.entries()) {
		await vdb.insertItem({
			vector: e,
			metadata: { text: text[index] },
		});
	}
}