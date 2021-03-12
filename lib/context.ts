import http from 'http';
import qs from 'querystring';
import { isObject, isUndefined } from './common/utils';
import { BodyOptions } from './decorators/httpParams';

export default class Context {
  /**
   * 发送响应
   * @param response 响应
   * @param path 路由
   * @param data 数据
   */
  public static send(response: http.ServerResponse, path: string, data: any) {
    response.setHeader('X-Powered-By', 'XS Server/2.0');
    if (isUndefined(data)) {
      response.statusCode = 404;
      return response.end(`Cannot find ${path}`);
    }
    if (isObject(data)) {
      response.setHeader('Content-Type', 'application/json');
      return response.end(JSON.stringify(data));
    }
    response.end(data);
  }

  /**
   * 处理body
   * @param request 请求
   * @param bodyOptions 需要接收的body配置
   */
  public static bodyParser(
    request: http.IncomingMessage,
    bodyOptions?: BodyOptions[]
  ): Promise<unknown[]> {
    return new Promise((resolve, reject) => {
      if (bodyOptions) {
        let body: Uint8Array[] = [];

        request.on('error', (err) => {
          reject(err);
        });

        request.on('data', (chunk) => {
          body.push(chunk);
        });

        request.on('end', () => {
          const data = Buffer.concat(body).toString();
          const parseData = qs.parse(data);

          // 获取需要的body参数
          const dataKeys = Object.keys(parseData);
          const existKeys = bodyOptions.map((option) => option.name);
          const resultData: unknown[] = [];

          dataKeys.forEach((key) => {
            if (existKeys.includes(key)) {
              resultData.push(parseData[key]);
            }
          });

          resolve(resultData);
        });
      }
    });
  }
}
