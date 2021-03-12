import { PREFIX, ROUTEMAP, ROUTER, ROUTES } from '../common/constant';
import { generateRouterKey } from '../common/utils';
import { RouteKey, RouteMap } from './controller';

export type Router = Map<string, Function>;

/**
 * 注入路由
 * @param controllers 控制器
 */
export function injectRouter(controllers?: any[]): ClassDecorator {
  return (target: any) => {
    const router: Router = new Map();
    controllers?.forEach((Route) => {
      const routeMap: RouteMap = Reflect.getMetadata(ROUTEMAP, Route);
      const prefix = Reflect.getMetadata(PREFIX, Route);

      for (const route of routeMap) {
        router.set(
          generateRouterKey(route[0].method, prefix + route[0].path),
          route[1]
        );
      }
    });

    Reflect.defineMetadata(ROUTER, router, target);
  };
}
