import type { RequestHandler } from 'express';
import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const logger: RequestHandler = async (req, res, next) => {
  const message = `${new Date().toISOString()} ${req.method.padEnd(6, ' ')} ${req.url}\n`;
  const logsDir = path.join(import.meta.dirname, '../../logs');
  const logPath = path.join(logsDir, 'requests.log');

  try {
    await mkdir(logsDir, { recursive: true });
    await appendFile(logPath, message, 'utf8');
  } catch (err) {
    console.error('Failed to write log:', err);
  }

  next();
};

export default logger;
