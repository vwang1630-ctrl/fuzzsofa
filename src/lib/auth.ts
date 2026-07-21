import crypto from 'crypto';
import { queryOne, executeInsert } from './db';

// JWT-like session token (simplified - uses HMAC for integrity)
const SECRET = process.env.AUTH_SECRET || 'fuzz-sofa-secret-key-change-in-production';
const TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface UserSession {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  exp: number;
}

export interface User {
  id: string;
  email: string | null;
  phone: string | null;
  password_hash: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Hash password
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

// Verify password
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}

// Create session token
export function createToken(user: { id: string; email: string | null; role: string }): string {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + TOKEN_EXPIRY,
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = crypto.createHmac('sha256', SECRET).update(payloadStr).digest('base64');
  return `${payloadStr}.${signature}`;
}

// Verify session token
export function verifyToken(token: string): UserSession | null {
  try {
    const [payloadStr, signature] = token.split('.');
    if (!payloadStr || !signature) return null;

    const expectedSig = crypto.createHmac('sha256', SECRET).update(payloadStr).digest('base64');
    if (signature !== expectedSig) return null;

    const payload = JSON.parse(Buffer.from(payloadStr, 'base64').toString()) as UserSession;
    if (payload.exp < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}

// Get user from session header
export async function getUserFromSession(token: string): Promise<User | null> {
  const session = verifyToken(token);
  if (!session) return null;

  const user = await queryOne<User>(
    'SELECT * FROM users WHERE id = ? AND is_active = TRUE',
    [session.userId]
  );
  return user;
}

// Get admin from session header
export async function getAdminFromSession(token: string): Promise<User | null> {
  const user = await getUserFromSession(token);
  if (!user || user.role !== 'admin') return null;
  return user;
}

// Register new user
export async function registerUser(data: {
  email?: string;
  phone?: string;
  password: string;
  firstName?: string;
  lastName?: string;
}): Promise<{ user: User; token: string }> {
  const id = crypto.randomUUID();
  const passwordHash = hashPassword(data.password);

  await executeInsert(
    `INSERT INTO users (id, email, phone, password_hash, first_name, last_name, role)
     VALUES (?, ?, ?, ?, ?, ?, 'user')`,
    [id, data.email || null, data.phone || null, passwordHash, data.firstName || null, data.lastName || null]
  );

  const user = await queryOne<User>('SELECT * FROM users WHERE id = ?', [id]);
  if (!user) throw new Error('Failed to create user');

  const token = createToken(user);
  return { user, token };
}

// Login user
export async function loginUser(data: {
  email?: string;
  phone?: string;
  password: string;
}): Promise<{ user: User; token: string } | null> {
  let user: User | null = null;

  if (data.email) {
    user = await queryOne<User>('SELECT * FROM users WHERE email = ? AND is_active = TRUE', [data.email]);
  } else if (data.phone) {
    user = await queryOne<User>('SELECT * FROM users WHERE phone = ? AND is_active = TRUE', [data.phone]);
  }

  if (!user || !user.password_hash) return null;
  if (!verifyPassword(data.password, user.password_hash)) return null;

  const token = createToken(user);
  return { user, token };
}
