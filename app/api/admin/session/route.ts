import { NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_TTL_SECONDS,
  createAdminSessionToken,
  hasAdminSession,
  verifyAdminPin,
} from '@/src/lib/adminAuth';

export async function GET() {
  try {
    return NextResponse.json({ authenticated: await hasAdminSession() });
  } catch (error) {
    console.error('Admin session configuration error:', error);
    return NextResponse.json({ error: 'Admin sign-in is not configured on the server.' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  let body: { pin?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Enter a valid passcode.' }, { status: 400 });
  }

  if (typeof body.pin !== 'string' || body.pin.length === 0 || body.pin.length > 128) {
    return NextResponse.json({ error: 'Enter a valid passcode.' }, { status: 400 });
  }

  try {
    if (!verifyAdminPin(body.pin)) {
      return NextResponse.json({ error: 'Incorrect passcode. Please try again.' }, { status: 401 });
    }

    const response = NextResponse.json({ authenticated: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: ADMIN_SESSION_TTL_SECONDS,
    });
    return response;
  } catch (error) {
    console.error('Admin sign-in configuration error:', error);
    return NextResponse.json({ error: 'Admin sign-in is not configured on the server.' }, { status: 503 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(ADMIN_SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
  return response;
}
