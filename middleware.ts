import { next } from '@vercel/edge';

export default function middleware(request: Request): Response {
  const urlPath = new URL(request.url).pathname;
  const hasFileExtension = /\.\w+$/.test(urlPath);

  if (hasFileExtension)
    return next(); // Do nothing

  return Response.redirect('/');
}
