import { answerWithOpenAI, toHttpError } from "../server/openaiCore";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  try {
    const { documentText, analysisResult, question, mode } = req.body || {};

    if (typeof question !== "string" || question.trim().length === 0 || (mode !== "document" && mode !== "general")) {
      res.status(400).json({ error: "Please provide a question." });
      return;
    }

    const answer = await answerWithOpenAI({
      documentText: documentText || null,
      analysisResult: analysisResult || null,
      question,
      mode,
    });

    res.status(200).json({ answer });
  } catch (error) {
    const httpError = toHttpError(error);
    res.status(httpError.statusCode).json(httpError.body);
  }
}
