export class TemplateError extends Error {
  constructor(readonly code: string, message: string, readonly payload: Record<string, unknown> = {}) {
    super(message);
  }
}
