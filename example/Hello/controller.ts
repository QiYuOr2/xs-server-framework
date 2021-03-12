import Controller from '../../lib/decorators/controller';
import { Get, Post } from '../../lib/decorators/method';

@Controller('/hello')
export default class HelloContorller {
  @Get()
  public async find() {
    return '123get';
  }
  @Post()
  public async create() {
    return '456post';
  }
}
