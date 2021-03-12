import { BODY } from '../common/constant';

export type BodyOptions = {
  name: string;
  propertyKey: string | symbol;
  index: number;
};

export function Body(name: string): ParameterDecorator {
  return (target, propertyKey, index) => {
    if (!Reflect.getMetadata(BODY, target)) {
      Reflect.defineMetadata(BODY, [], target);
    }
    const bodyOptions: BodyOptions[] = Reflect.getMetadata(BODY, target);

    bodyOptions.push({ name, propertyKey, index });
  };
}
