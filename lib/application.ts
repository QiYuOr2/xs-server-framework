import 'reflect-metadata';
import http from 'http';
import url from 'url';
import { ROUTER } from './common/constant';
import { HttpMethod } from './decorators/method';
import { generateRouterKey } from './common/utils';
import { Router } from './decorators/router';
import Context from './context';
import composeMiddleware, { Middleware } from './common/composeMiddleware';

export default class Application {
  private static httpServer: http.Server;
  private static middlewares: Middleware[] = [];

  /**
   * 创建http server
   */
  private static create() {
    this.httpServer = http.createServer(this.requestHandler());
  }

  /**
   * 请求处理
   */
  private static requestHandler(): http.RequestListener {
    // 中间件
    const fn = composeMiddleware(this.middlewares);

    const router: Router = Reflect.getMetadata(ROUTER, this);
    return async (request, response) => {
      fn(request, response, () => {});

      const urlParse = url.parse(request.url ?? '');
      const routeKey = generateRouterKey(
        (request.method ?? 'GET') as HttpMethod,
        urlParse.pathname ?? ''
      );

      const handle = router.get(routeKey)?.handle;

      // 处理query
      const queryOptions = router.get(routeKey)?.queryOptions;
      Context.QueryParser(urlParse.query ?? '', queryOptions);

      // 处理body
      const bodyOptions = router.get(routeKey)?.bodyOptions;
      Context.bodyParser(request, bodyOptions);

      let result;
      if (handle) {
        result = await handle(...Context.paramList);
      }
      Context.send(response, urlParse.pathname ?? '', result);
    };
  }

  public static use(middleware: Middleware) {
    this.middlewares.push(middleware);
    return this;
  }

  /**
   * 开启监听
   * @param port 端口
   * @param cb 回调
   */
  public static listen(port?: number, cb?: () => void) {
    this.create();

    this.httpServer.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
      cb?.();
    });
  }
}
