import { rewrite } from '@vercel/edge';

export default function middleware(_request: Request): Response {
  return rewrite('/');
}
