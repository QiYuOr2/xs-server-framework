import { PREFIX, ROUTEMAP, ROUTES } from '../common/constant';
import { isAsync } from '../common/utils';
import { HttpMethod, Route } from './method';

export type RouteKey = {
  path: string;
  method: HttpMethod;
};

export type RouteMap = Map<RouteKey, Function>;

export default function Controller(prefix: string = ''): ClassDecorator {
  return (target: Function) => {
    // 前缀
    Reflect.defineMetadata(PREFIX, prefix, target);
    const routes: Route[] = Reflect.getMetadata(ROUTES, target.prototype);

    // route - 方法 映射表
    const routeMap: RouteMap = new Map();
    routes.forEach((route) => {
      if (!isAsync(target.prototype[route.propertyKey])) {
        throw new TypeError(
          'The method in the controller should be an async function'
        );
      }

      routeMap.set(
        { path: route.path, method: route.method },
        target.prototype[route.propertyKey]
      );
    });

    Reflect.defineMetadata(ROUTEMAP, routeMap, target);
  };
}
