import 'reflect-metadata';
import http from 'http';
import { ROUTER } from './common/constant';
import { HttpMethod } from './decorators/method';
import { generateRouterKey } from './common/utils';
import { Router } from './decorators/router';

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
      const routeKey = generateRouterKey(
        (request.method ?? 'GET') as HttpMethod,
        request.url ?? ''
      );

      const result = await router.get(routeKey)?.();
      response.end(JSON.stringify(result));
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
