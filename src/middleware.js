import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRETKEY);

async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  if (path.startsWith('/api/users/')) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  const verifiedToken = token ? await verifyToken(token) : null;
  const isPublicPath = path === '/login' || path === '/register';

  if (verifiedToken) {
    if (isPublicPath) {
      return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
    }
    return NextResponse.next();
  } else {
    if (!isPublicPath) {
      return NextResponse.redirect(new URL('/login', request.nextUrl));
    }
    return NextResponse.next(); // Allow access to login/register
  }
}

export const config = {
  matcher: ['/', '/login', '/register', '/dashboard'],
};
