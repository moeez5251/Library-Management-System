import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT)

export async function middleware(request) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET)
    console.log("✅ Verified:", payload);
    return NextResponse.next();
  } catch (e) {
    console.error("❌ Invalid token:", e.message);
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: '/admin/:path*',
};
