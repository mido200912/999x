/**
 * middlewares/sanitize.ts — Layer 4: NoSQL Injection Guard + XSS Sanitizer
 * 999x.md Section 6: Zod Deep Sanitization and NoSQL Injection Guard
 */
import type { MiddlewareHandler } from "hono";

function sanitizeValue(val: unknown): unknown {
  if (typeof val === "string") {
    return val
      .replace(/<[^>]*>/g, "")
      .replace(/^\$/, "")
      .trim()
      .slice(0, 8192);
  }
  if (Array.isArray(val)) return val.map(sanitizeValue);
  if (val !== null && typeof val === "object") return sanitizeObject(val as Record<string, unknown>);
  return val;
}

function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith("$") || key.includes("\x00")) continue;
    clean[key] = sanitizeValue(value);
  }
  return clean;
}

export const sanitizeBody: MiddlewareHandler = async (c, next) => {
  const ct = c.req.header("content-type") ?? "";
  if (ct.includes("application/json")) {
    try {
      const raw = await c.req.raw.clone().json();
      const clean = sanitizeValue(raw);
      // Store sanitized body in context — routes must use c.get('sanitizedBody') || c.req.json()
      c.set('sanitizedBody' as any, clean);
    } catch {}
  }
  await next();
};

export const blockSuspiciousQuery: MiddlewareHandler = async (c, next) => {
  const url = c.req.url;
  if (/\$(?:where|ne|gt|lt|gte|lte|in|nin|or|and|not|nor|exists|type|regex)\b/i.test(url)) {
    return c.json({ success: false, error: { code: "FORBIDDEN", message: "Suspicious query rejected" } }, 403);
  }
  await next();
};

/**
 * Zod schema validation helper middleware
 */
export const validateBody = (schema: any): MiddlewareHandler => async (c, next) => {
  try {
    const body = await c.req.json();
    schema.parse(body); // Throws ZodError if invalid
    await next();
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return c.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: error.errors
        }
      }, 400);
    }
    throw error;
  }
};
