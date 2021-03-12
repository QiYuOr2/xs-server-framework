import Controller from '../../../lib/decorators/controller';
import { Body } from '../../../lib/decorators/httpParams';
import { Get, Post } from '../../../lib/decorators/method';

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
