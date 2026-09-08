export class AppError {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly statusCode: number = 400,
    public readonly details?: Record<string, unknown>,
  ) {}
  static notFound(resource: string) {
    return new AppError('RESOURCE_NOT_FOUND', `${resource} was not found`, 404);
  }
  static unauthorized(msg = 'Access denied'): AppError {
    return new AppError('UNAUTHORIZED', msg, 401);
  }
  static forbidden(msg = 'Forbidden') {
    return new AppError('FORBIDDEN', msg, 403);
  }
  static validation(msg: string, details?: Record<string, unknown>) {
    return new AppError('VALIDATION_ERROR', msg, 422, details);
  }
  static aiEngineFailure(detail: string) {
    return new AppError('AI_PROCESSING_ERROR', `AI Gateway error: ${detail}`, 502);
  }
  static quotaExceeded() {
    return new AppError('QUOTA_EXCEEDED', 'Monthly token budget exceeded', 429);
  }
}

export type Result<T, E = AppError> = { success: true; data: T } | { success: false; error: E };

export const ok = <T>(data: T): Result<T> => ({ success: true, data });
export const err = <E = AppError>(error: E): Result<never, E> => ({ success: false, error });

export const fromThrowable = async <T>(fn: () => Promise<T>): Promise<Result<T>> => {
  try {
    return ok(await fn());
  } catch (e) {
    if (e instanceof AppError) return err(e);
    return err(new AppError('INTERNAL_ERROR', (e as Error).message ?? 'Unknown', 500));
  }
};
