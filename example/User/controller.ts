import Controller from '../../lib/decorators/controller';
import { Get } from '../../lib/decorators/method';

@Controller('/user')
export default class UserContorller {
  @Get()
  public async find() {
    return 'userGet';
  }

  @Get()
  public async findOne() {
    return 'one get';
  }
}
