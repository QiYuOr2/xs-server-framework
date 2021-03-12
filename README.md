# 装饰器风格 Nodejs 框架

- 目前可用装饰器：`@Get`, `@Post`, `@Put`, `@Delete`, `@Body`, `@Query`, `@injectRouter`

## 运行示例

- `npm install`

- `npm run example`

## 使用

### 创建控制器

```typescript
// user/controller
@Controller('/user')
export default class UserContorller {
  @Get()
  public async find() {
    return 'userGet';
  }

  @Get('/one')
  public async findOne(@Query('id') id: number) {
    return {
      code: 0,
      success: 'success',
      data: id,
    };
  }
}

// hello/controller.ts
@Controller('/hello')
export default class HelloContorller {
  @Get()
  public async find() {
    return '123get';
  }

  @Post()
  public async create(
    @Body('hello') hello: string,
    @Body('world') world: string
  ) {
    return {
      code: 0,
      message: 'success',
      data: hello + world,
    };
  }
}
```

### 创建入口程序

```typescript
import Application from '../lib/application';
import { injectRouter } from '../lib/decorators/router';
import HelloContorller from './Hello/controller';
import UserContorller from './User/controller';

@injectRouter([HelloContorller, UserContorller])
class Main extends Application {
  public static async run() {
    this.listen(3000);
  }
}

Main.run();
```
