import { rewrite } from '@vercel/edge';

export default function middleware(request: Request): Response {
  const urlPath = new URL(request.url).pathname;
  const hasFileExtension = /\.\w+$/.test(urlPath);

  return rewrite(hasFileExtension ? urlPath : '/');
}
