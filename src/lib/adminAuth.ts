import 'server-only';

import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

export const ADMIN_SESSION_COOKIE = 'admin_session';
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 8;

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('ADMIN_SESSION_SECRET must be configured with at least 32 characters.');
  }
  return secret;
}

export function verifyAdminPin(pin: string) {
  const configuredPin = process.env.ADMIN_PIN;
  if (!configuredPin) {
    throw new Error('ADMIN_PIN is not configured.');
  }
  if (configuredPin.length < 12) {
    throw new Error('ADMIN_PIN must be at least 12 characters long.');
  }

  const submittedHash = createHash('sha256').update(pin).digest();
  const configuredHash = createHash('sha256').update(configuredPin).digest();
  return timingSafeEqual(submittedHash, configuredHash);
}

export function createAdminSessionToken() {
  const expiresAt = Math.floor(Date.now() / 1000) + ADMIN_SESSION_TTL_SECONDS;
  const payload = String(expiresAt);
  const signature = createHmac('sha256', getSessionSecret()).update(payload).digest('hex');
  return `${payload}.${signature}`;
}

export function verifyAdminSessionToken(token?: string) {
  if (!token) return false;

  const [expiresAtText, signature, ...extra] = token.split('.');
  if (!expiresAtText || !signature || extra.length > 0) return false;

  const expiresAt = Number(expiresAtText);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000)) {
    return false;
  }

  const expectedSignature = createHmac('sha256', getSessionSecret())
    .update(expiresAtText)
    .digest();
  const submittedSignature = Buffer.from(signature, 'hex');
  return submittedSignature.length === expectedSignature.length &&
    timingSafeEqual(submittedSignature, expectedSignature);
}

export async function hasAdminSession() {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSessionToken(token);
}
