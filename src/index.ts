import path from 'path';
import Server from './server';
import { bodyParse, queryParse } from './utils';

const config = require('../package.json');

const server = Server.create(config.port, function () {
  console.log(`running in ${config.port}`);
});

// 设置静态服务
server.setStatic('/public', path.join(__dirname, './example'));

// 测试registerRouter
// powershell & bash: curl http://localhost:3000/hello
server.registerRouter([
  {
    pathname: '/',
    method: 'GET',
    handle: () => {
      return {
        code: 0,
        message: '欢迎使用XS框架',
      };
    },
  },
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
// powershell & bash: curl http://localhost:3000/hello/world?name=1
server.Get('/hello/world', (ctx) => {
  const query = queryParse(ctx.request);

  return {
    code: 0,
    message: 'World',
    data: query,
  };
});

// 测试POST
// powershell: curl http://localhost:3000/hello -Method Post /* 不知道powershell怎么传body参数 */
// bash: curl http://localhost:3000/hello -X POST -d '{"name": 123}'
server.Post('/hello', async (ctx) => {
  const body = await bodyParse(ctx.request);

  return {
    code: 0,
    message: 'POST: Hello',
    data: body,
  };
});
