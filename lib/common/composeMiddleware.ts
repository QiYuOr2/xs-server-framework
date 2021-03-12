import { IncomingMessage, ServerResponse } from 'http';

export interface Middleware {
  (req: IncomingMessage, res: ServerResponse, next: () => Promise<void>): void;
}

export default function composeMiddleware(middlewares: Middleware[]) {
  if (!Array.isArray(middlewares)) {
    throw new TypeError('Middleware stack must be an array');
  }
  for (const middleware of middlewares) {
    if (typeof middleware !== 'function') {
      throw new TypeError('Middleware must be composed of functions');
    }
  }

  return (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    let start = -1;
    function dispatch(index: number): Promise<void> {
      // 同一个中间件中执行了多次next()时
      if (index <= start) {
        return Promise.reject(new Error('next() call more than once'));
      }
      start = index;
      let fn = middlewares[index];
      if (index === middlewares.length) {
        fn = next;
      }
      if (!fn) {
        return Promise.resolve();
      }

      try {
        return Promise.resolve(fn(req, res, dispatch.bind(null, index + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
    dispatch(0);
  };
}
