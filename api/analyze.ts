import { analyzeWithOpenAI, toHttpError } from "../server/openaiCore";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  try {
    const { situation, text, helpGoal } = req.body || {};

    if (!situation || typeof text !== "string" || text.trim().length < 10) {
      res.status(400).json({ error: "Please provide document text before analyzing." });
      return;
    }

    const result = await analyzeWithOpenAI(situation, text, helpGoal);
    res.status(200).json(result);
  } catch (error) {
    const httpError = toHttpError(error);
    res.status(httpError.statusCode).json(httpError.body);
  }
}
