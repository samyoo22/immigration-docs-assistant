import { translateWithOpenAI, toHttpError } from "../server/openaiCore";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  try {
    const { analysis, checklistItems, targetLang } = req.body || {};

    if (!analysis || !Array.isArray(checklistItems) || !targetLang) {
      res.status(400).json({ error: "Missing translation input." });
      return;
    }

    const result = await translateWithOpenAI(analysis, checklistItems, targetLang);
    res.status(200).json(result);
  } catch (error) {
    const httpError = toHttpError(error);
    res.status(httpError.statusCode).json(httpError.body);
  }
}
