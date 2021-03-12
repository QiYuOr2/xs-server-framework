import { BODY, PREFIX, QUERY, ROUTEMAP, ROUTES } from '../common/constant';
import { isAsync } from '../common/utils';
import { Options } from './httpParams';
import { HttpMethod, Route } from './method';

export type RouteKey = {
  path: string;
  method: HttpMethod;
};

export type RouteVal = {
  handle: Function;
  bodyOptions: Options[];
  queryOptions: Options[];
};

export type RouteMap = Map<RouteKey, RouteVal>;

export default function Controller(prefix: string = ''): ClassDecorator {
  return (target: Function) => {
    // 前缀
    Reflect.defineMetadata(PREFIX, prefix, target);
    const routes: Route[] = Reflect.getMetadata(ROUTES, target.prototype);

    // body参数
    const bodyOptions: Options[] | undefined = Reflect.getMetadata(
      BODY,
      target.prototype
    );

    // query参数
    const queryOptions: Options[] | undefined = Reflect.getMetadata(
      QUERY,
      target.prototype
    );

    // route - 方法 映射表
    const routeMap: RouteMap = new Map();
    routes.forEach((route) => {
      if (!isAsync(target.prototype[route.propertyKey])) {
        throw new TypeError(
          'The method in the controller should be an async function'
        );
      }

      let routeVal: RouteVal = {
        handle: target.prototype[route.propertyKey],
        bodyOptions: [],
        queryOptions: [],
      };

      bodyOptions?.forEach((option) => {
        if (option.propertyKey === route.propertyKey) {
          routeVal.bodyOptions.push(option);
        }
      });

      queryOptions?.forEach((option) => {
        if (option.propertyKey === route.propertyKey) {
          routeVal.queryOptions.push(option);
        }
      });

      routeMap.set({ path: route.path, method: route.method }, routeVal);
    });

    Reflect.defineMetadata(ROUTEMAP, routeMap, target);
  };
}
