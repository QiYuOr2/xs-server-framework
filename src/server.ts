import http, {
  IncomingMessage,
  OutgoingHttpHeader,
  OutgoingHttpHeaders,
  ServerResponse,
} from 'http';
import url from 'url';
import { Method, Route, RouteHandle } from './interfaces';
import fs from 'fs';
import { parsePathname } from './utils';
import path from 'path';

export default class Server {
  private static instance: Server;
  private httpServer: http.Server;
  private router: Router;
  private header: OutgoingHttpHeaders | OutgoingHttpHeader[];
  private staticPath: string[] = [];
  private pathToDir: Map<string, string> = new Map();

  private constructor(port: number, listenCallback?: () => void) {
    this.httpServer = http.createServer();
    this.router = new Router();
    this.httpServer.listen(port, listenCallback);
    this.header = { 'Content-Type': 'application/json;charset=utf-8' };

    this.openListenRequest();
  }

  public static create(port: number, listenCallback?: () => void) {
    if (!Server.instance) {
      Server.instance = new Server(port, listenCallback);
    }
    return Server.instance;
  }

  /**
   * 开启请求监听
   */
  private openListenRequest() {
    this.httpServer.on('request', async (req, res) => {
      res.writeHead(200, this.header);

      const pathname = url.parse(req.url, true).pathname || '';
      const firstPath = parsePathname(pathname)[1]
        ? `/${parsePathname(pathname)[1]}`
        : '/';

      if (this.staticPath.includes(firstPath)) {
        const filePath =
          this.pathToDir.get(firstPath) +
          pathname.replace(firstPath, '').replace(/\//g, '\\');

        return this.outputFile(filePath, res);
      }

      const handle = this.router.getRouter(req.method).get(pathname);

      if (handle) {
        if (
          Object.prototype.toString.call(handle) === '[object AsyncFunction]'
        ) {
          res.end(
            JSON.stringify(await handle({ request: req, response: res }))
          );
        } else {
          res.end(JSON.stringify(handle({ request: req, response: res })));
        }
      } else {
        res.end(`${pathname} not found`);
      }
    });
  }

  /**
   * 设置全局Header
   */
  public setHeader(header: OutgoingHttpHeaders | OutgoingHttpHeader[]) {
    this.header = header;
  }

  public registerRouter(routes: Route<any>[]) {
    this.router.setRouter(routes);
  }

  public Get<T>(path: string, handle: RouteHandle<T>) {
    this.router.setRouter({
      pathname: path,
      method: 'GET',
      handle,
    });
  }

  public Post<T>(path: string, handle: RouteHandle<T>) {
    this.router.setRouter({
      pathname: path,
      method: 'POST',
      handle,
    });
  }

  public Put<T>(path: string, handle: RouteHandle<T>) {
    this.router.setRouter({
      pathname: path,
      method: 'PUT',
      handle,
    });
  }

  public Delete<T>(path: string, handle: RouteHandle<T>) {
    this.router.setRouter({
      pathname: path,
      method: 'DELETE',
      handle,
    });
  }

  public setStatic(path: string, dirPath: string) {
    this.staticPath.push(path);
    this.pathToDir.set(path, dirPath);
  }

  private outputFile(pathname: string, res: ServerResponse) {
    fs.readFile(pathname, function (err, fileContent) {
      if (err) {
        res.writeHead(404, 'not Found');
        res.end('<h1>Not Found!</h1>');
      } else {
        res.writeHead(200, 'okay');
        res.write(fileContent, 'binary');
        res.end();
      }
    });
  }
}

export class Router {
  private getRoute: Map<string, RouteHandle<any>>;
  private postRoute: Map<string, RouteHandle<any>>;
  private putRoute: Map<string, RouteHandle<any>>;
  private deleteRoute: Map<string, RouteHandle<any>>;

  constructor(routes?: Route<any>[]) {
    this.getRoute = new Map();
    this.postRoute = new Map();
    this.putRoute = new Map();
    this.deleteRoute = new Map();

    routes && this.setRouter(routes);
  }

  /**
   * 设置路由
   * @param route 路由
   */
  setRouter(route: Route<any>): void;
  /**
   * 设置路由
   * @param route 路由数组
   */
  setRouter(route: Route<any>[]): void;
  public setRouter(route: Route<any> | Route<any>[]) {
    if (Array.isArray(route)) {
      route.forEach((item) => {
        switch (item.method) {
          case 'GET':
            this.getRoute.set(item.pathname, item.handle);
            break;
          case 'POST':
            this.postRoute.set(item.pathname, item.handle);
            break;
          case 'PUT':
            this.putRoute.set(item.pathname, item.handle);
            break;
          case 'DELETE':
            this.deleteRoute.set(item.pathname, item.handle);
            break;

          default:
            throw new Error(`Cannt find method ${item.method}`);
        }
      });
    } else {
      switch (route.method) {
        case 'GET':
          this.getRoute.set(route.pathname, route.handle);
          break;
        case 'POST':
          this.postRoute.set(route.pathname, route.handle);
          break;
        case 'PUT':
          this.putRoute.set(route.pathname, route.handle);
          break;
        case 'DELETE':
          this.deleteRoute.set(route.pathname, route.handle);
          break;

        default:
          throw new Error(`Cannt find method ${route.method}`);
      }
    }
  }

  public getRouter(method: Method) {
    switch (method) {
      case 'GET':
        return this.getRoute;
      case 'POST':
        return this.postRoute;
      case 'PUT':
        return this.putRoute;
      case 'DELETE':
        return this.deleteRoute;
    }
  }
}
