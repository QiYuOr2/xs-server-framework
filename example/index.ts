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
