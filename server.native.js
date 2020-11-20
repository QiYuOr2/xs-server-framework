/**
 * 原生nodejs服务器
 * @author 徐梦宇
 */

const http = require('http');
const url = require('url');
const qs = require('querystring');
const package = require('./package.json');
const static = require('node-static');
const path = require('path');

const data = {
  code: 0,
  message: 'success',
  data: [
    { img_url: '/images/2020111500.jpg', title: '习近平在十九大上的报告' },
    { img_url: '/images/2020111501.jpg', title: '习近平在福建考察调研' },
    { img_url: '/images/2020111502.jpg', title: '习近平在扬州考察调研' },
    {
      img_url: '/images/2020111503.jpg',
      title: '习近平赴江苏南通考察长江生态',
    },
    { img_url: '/images/2020111504.jpg', title: '习近平在西藏考察调研' },
  ],
};

const fileServer = new static.Server(path.join(__dirname, './images'));

/**
 * 请求轮播图
 * @param {*} req Request
 * @param {*} res Response
 */
function requestSwiper(req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });

  const query = qs.parse(req.url.split('?')[1]);

  if (query && query.callback) {
    const result = `${query.callback}(${JSON.stringify(data)})`;

    res.end(result);
  } else {
    res.end(JSON.stringify(package.RequestError.BadRequest));
  }
}

/**
 * 请求静态资源
 * @param {*} req Request
 * @param {*} res Response
 */
function requestStatic(req, res) {
  const pathname = url.parse(req.url, true).pathname;
  const filename = parsePathname(pathname)[2]
    ? `/${parsePathname(pathname)[2]}`
    : '';

  req.url.pathname = filename;

  req
    .addListener('end', function () {
      fileServer.serve(req, res, function (err, result) {
        if (err) {
          return res.end(
            JSON.stringify({
              code: 1,
              message: `${filename} - ${err.message}`,
            })
          );
        }
      });
    })
    .resume();
}

/**
 * 错误的请求
 * @param {*} req Request
 * @param {*} res Response
 * @param {*} errorMessage 要返回的错误响应
 */
function requestError(_req, res, errorMessage) {
  res.end(JSON.stringify(errorMessage));
}

/**
 * 注册路由
 */
function registerRouter() {
  const routerMap = new Map();

  routerMap.set('/', function (req, res) {
    res.end('Welcome to use Swiper API');
  });
  routerMap.set('/swiper', requestSwiper);
  routerMap.set('/images', requestStatic);

  return routerMap;
}

/**
 * 拆分pathname
 * @param {*} pathname pathname
 */
function parsePathname(pathname) {
  return pathname.split('/');
}

function main() {
  const server = http.createServer();

  server.on('request', function (req, res) {
    const pathname = url.parse(req.url, true).pathname;
    const firstPath = parsePathname(pathname)[1]
      ? `/${parsePathname(pathname)[1]}`
      : '/';

    const responseFunc = registerRouter().get(firstPath);
    if (typeof responseFunc === 'undefined') {
      requestError(req, res, package.RequestError.NotExist);
    } else {
      responseFunc(req, res);
    }
  });

  server.listen(package.port, function () {
    console.log(`server running at http://localhost:${package.port}`);
  });
}

main();
