import Controller from '../../../lib/decorators/controller';
import { Query } from '../../../lib/decorators/httpParams';
import { Get } from '../../../lib/decorators/method';

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
