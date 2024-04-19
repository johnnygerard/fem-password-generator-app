import { next } from '@vercel/edge';

const MOVE_PERMANENTLY = 301;

export default function middleware(request: Request): Response {
  const url = new URL(request.url);
  const hasFileExtension = /\.\w+$/.test(url.pathname);

  if (hasFileExtension || url.pathname === '/')
    return next(); // Do nothing

  url.pathname = '/';
  return Response.redirect(url, MOVE_PERMANENTLY);
}
