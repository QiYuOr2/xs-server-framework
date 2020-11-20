import { IncomingMessage } from 'http';
import querystring from 'querystring';
import url from 'url';

export function parsePathname(pathname: string) {
  return pathname.split('/');
}

/**
 * 解析Body
 * @param req Request
 */
export function bodyParse(req: IncomingMessage) {
  return new Promise((resolve, reject) => {
    let body = '';
    try {
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        resolve(querystring.parse(body));
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * 解析Query
 * @param req Request
 */
export function queryParse(req: IncomingMessage) {
  const { query } = url.parse(req.url as string);
  if (query) {
    return querystring.parse(query);
  }
}
