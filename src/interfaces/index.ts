import { IncomingMessage } from 'http';

export type ResType<T> = {
  code: number;
  message: string;
  data?: T;
};

/**
 * 路由处理函数
 */
export type RouteHandle<T> = (
  req: IncomingMessage
) => ResType<T> | Promise<ResType<T>>;
export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type Route<T> = {
  pathname: string;
  method: Method;
  handle: RouteHandle<T>;
};
