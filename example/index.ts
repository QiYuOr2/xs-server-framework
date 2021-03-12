import Application from '../lib/application';
import { injectRouter } from '../lib/decorators/router';
import logger from './common/logger';
import HelloContorller from './modules/hello/controller';
import UserContorller from './modules/user/controller';

@injectRouter([HelloContorller, UserContorller])
class Main extends Application {
  public static async run() {
    this.use(logger());

    this.listen(3000);
  }
}

Main.run();
