import { IncomingMessage, ServerResponse } from 'http';

export type Context = {
  request: IncomingMessage;
  response: ServerResponse;
};
/**
 * 路由处理函数
 */
export type RouteHandle<T> = (ctx: Context) => T | Promise<T>;
export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type Route<T> = {
  pathname: string;
  method: Method;
  handle: RouteHandle<T>;
};
