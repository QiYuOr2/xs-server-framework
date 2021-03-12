import { HttpMethod } from '../decorators/method';

/**
 * 生成路由表示符
 * @param method 方法
 * @param path url
 */
export function generateRouterKey(method: HttpMethod, path: string) {
  return `${method}::${path}`;
}

/**
 * 判断类型
 * @param fn 需要判断的对象
 */
export function getType(fn: unknown) {
  return Object.prototype.toString.call(fn);
}

/**
 * 判断是否为异步函数
 * @param fn 函数
 */
export function isAsync(fn: unknown) {
  return getType(fn) === '[object AsyncFunction]';
}

export function isObject(fn: unknown) {
  return getType(fn) === '[object Object]';
}

export function isUndefined(fn: unknown) {
  return getType(fn) === '[object Undefined]';
}
