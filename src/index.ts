import Server from './server';
import { bodyParse, queryParse } from './utils';

const config = require('../package.json');

const server = Server.create(config.port, function () {
  console.log(`running in ${config.port}`);
});

// 测试registerRouter
// powershell & bash: curl http://localhost:3000/hello
server.registerRouter([
  {
    pathname: '/hello',
    method: 'GET',
    handle: () => {
      return {
        code: 0,
        message: 'Hello',
      };
    },
  },
]);

// 测试GET
// powershell & bash: curl http://localhost:3000/world?name=1
server.Get('/world', (req) => {
  const query = queryParse(req);

  return {
    code: 0,
    message: 'World',
    data: query,
  };
});

// 测试POST
// powershell: curl http://localhost:3000/hello -Method Post /* 不知道powershell怎么传body参数 */
// bash: curl http://localhost:3000/hello -X POST -d '{"name": 123}'
server.Post('/hello', async (req) => {
  const body = await bodyParse(req);

  return {
    code: 0,
    message: 'POST: Hello',
    data: body,
  };
});
