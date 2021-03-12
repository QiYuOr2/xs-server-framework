import 'reflect-metadata';
import http from 'http';
import url from 'url';
import { ROUTER } from './common/constant';
import { HttpMethod } from './decorators/method';
import { generateRouterKey } from './common/utils';
import { Router } from './decorators/router';
import Context from './context';

export default class Application {
  private static httpServer: http.Server;

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
    const router: Router = Reflect.getMetadata(ROUTER, this);
    return async (request, response) => {
      const urlParse = url.parse(request.url ?? '');
      const routeKey = generateRouterKey(
        (request.method ?? 'GET') as HttpMethod,
        urlParse.pathname ?? ''
      );

      const handle = router.get(routeKey)?.handle;
      // 处理body
      const bodyOptions = router.get(routeKey)?.bodyOptions;
      let result;
      const body = await Context.bodyParser(request, bodyOptions);
      if (handle) {
        result = await handle(...body);
      }
      Context.send(response, urlParse.pathname ?? '', result);
    };
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
