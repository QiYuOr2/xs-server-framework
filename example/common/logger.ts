import { Middleware } from '../../lib/common/composeMiddleware';

export default function logger(): Middleware {
  return async (req, res, next) => {
    const start = Date.now();
    await next();
    const time = Date.now() - start;
    console.log(`[INFO] ${req.method} - ${req.url} - ${time / 1000}ms`);
  };
}
