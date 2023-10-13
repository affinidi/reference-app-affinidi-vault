import { ZodError } from "zod"
import { Middleware } from "next-api-middleware";
import { ApiError } from '../api-error';
import { logger } from '../logger';

export const errorHandler: Middleware = async (req, res, next) => {
  try {
    await next()
  } catch (error) {
    if (error instanceof ZodError) {
      logger.debug({ error }, 'Zod validation error')
      res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          issues: error.issues,
        }
      })
    } else if (error instanceof ApiError) {
      logger.debug({ error }, 'API error')
      res.status(error.httpStatusCode).json({
        error: {
          code: error.code,
          message: error.message,
          context: error.context,
        }
      })
    } else {
      logger.error({ error }, 'Unhandled error')
      res.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
        }
      })
    }
  }
}
