import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { analyzeWithOpenAI, answerWithOpenAI, toHttpError, translateWithOpenAI } from './server/openaiCore';

const readJsonBody = async (req: any) => {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const rawBody = Buffer.concat(chunks).toString('utf8');
  return rawBody ? JSON.parse(rawBody) : {};
};

const sendJson = (res: any, statusCode: number, body: unknown) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
};

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    process.env.OPENAI_API_KEY = env.OPENAI_API_KEY || process.env.OPENAI_API_KEY;
    process.env.OPENAI_MODEL = env.OPENAI_MODEL || process.env.OPENAI_MODEL;

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      build: {
        target: 'esnext',
      },
      plugins: [
        react(),
        {
          name: 'visatodo-local-api',
          configureServer(server) {
            server.middlewares.use('/api/analyze', async (req, res) => {
              if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed.' });

              try {
                const { situation, text, helpGoal } = await readJsonBody(req);
                if (!situation || typeof text !== 'string' || text.trim().length < 10) {
                  return sendJson(res, 400, { error: 'Please provide document text before analyzing.' });
                }

                const result = await analyzeWithOpenAI(situation, text, helpGoal);
                return sendJson(res, 200, result);
              } catch (error) {
                const httpError = toHttpError(error);
                return sendJson(res, httpError.statusCode, httpError.body);
              }
            });

            server.middlewares.use('/api/translate', async (req, res) => {
              if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed.' });

              try {
                const { analysis, checklistItems, targetLang } = await readJsonBody(req);
                if (!analysis || !Array.isArray(checklistItems) || !targetLang) {
                  return sendJson(res, 400, { error: 'Missing translation input.' });
                }

                const result = await translateWithOpenAI(analysis, checklistItems, targetLang);
                return sendJson(res, 200, result);
              } catch (error) {
                const httpError = toHttpError(error);
                return sendJson(res, httpError.statusCode, httpError.body);
              }
            });

            server.middlewares.use('/api/ask', async (req, res) => {
              if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed.' });

              try {
                const { documentText, analysisResult, question, mode } = await readJsonBody(req);
                if (typeof question !== 'string' || question.trim().length === 0 || (mode !== 'document' && mode !== 'general')) {
                  return sendJson(res, 400, { error: 'Please provide a question.' });
                }

                const answer = await answerWithOpenAI({
                  documentText: documentText || null,
                  analysisResult: analysisResult || null,
                  question,
                  mode,
                });

                return sendJson(res, 200, { answer });
              } catch (error) {
                const httpError = toHttpError(error);
                return sendJson(res, httpError.statusCode, httpError.body);
              }
            });
          }
        }
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
