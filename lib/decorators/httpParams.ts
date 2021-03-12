import { BODY, QUERY } from '../common/constant';

export type Options = {
  name: string;
  propertyKey: string | symbol;
  index: number;
};

/**
 * 接收body参数的装饰器
 * @param name 参数名
 */
export function Body(name: string): ParameterDecorator {
  return (target, propertyKey, index) => {
    if (!Reflect.getMetadata(BODY, target)) {
      Reflect.defineMetadata(BODY, [], target);
    }
    const bodyOptions: Options[] = Reflect.getMetadata(BODY, target);

    bodyOptions.push({ name, propertyKey, index });
  };
}

/**
 * 接收query参数的装饰器
 * @param name 参数名
 */
export function Query(name: string): ParameterDecorator {
  return (target, propertyKey, index) => {
    if (!Reflect.getMetadata(QUERY, target)) {
      Reflect.defineMetadata(QUERY, [], target);
    }
    const queryOptions: Options[] = Reflect.getMetadata(QUERY, target);
    queryOptions.push({ name, propertyKey, index });
  };
}
