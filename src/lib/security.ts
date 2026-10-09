// Security Configuration for Albania-Turs
import { cookies } from 'next/headers';

// Security Headers Configuration
export const securityHeaders = {
  'X-XSS-Protection': '1; mode=block',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.stripe.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
};

// SSL Configuration
export const sslConfig = {
  forceSSL: true,
  redirectStatus: 301,
};

// Rate Limiting Configuration
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
};

// SQL Injection Prevention
export function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters
  return input
    .replace(/;/g, '') // Remove semicolons
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove block comments
    .replace(/\*\//g, '') // Remove block comment closure
    .replace(/0x[0-9a-fA-F]+/g, '') // Remove hex patterns
    .replace(/UNION/gi, '') // Remove UNION
    .replace(/SELECT/gi, '') // Remove SELECT
    .replace(/INSERT/gi, '') // Remove INSERT
    .replace(/UPDATE/gi, '') // Remove UPDATE
    .replace(/DELETE/gi, '') // Remove DELETE
    .replace(/DROP/gi, '') // Remove DROP
    .replace(/ALTER/gi, '') // Remove ALTER
    .replace(/TRUNCATE/gi, '') // Remove TRUNCATE
    .trim();
}

// XSS Prevention
export function sanitizeHTML(input: string): string {
  // Escape HTML characters
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Password Policy
export const passwordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: false, // Set to true for stricter policy
};

// 2FA Configuration
export const twoFAConfig = {
  enabled: true,
  methods: ['totp', 'email', 'sms'],
  ttl: 300, // Token TTL in seconds (5 minutes)
  window: 1, // Tolerance for time-based tokens
};

// Data Encryption
export const encryptionConfig = {
  algorithm: 'AES-256-GCM',
  ivLength: 16,
  tagLength: 16,
};

// Daily Backup Strategy
export const backupStrategy = {
  frequency: 'daily',
  retentionDays: 30,
  location: '/backups/daily',
  compress: true,
  encrypt: true,
};

// ReCAPTCHA Configuration
export const recaptchaConfig = {
  siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
  secretKey: process.env.RECAPTCHA_SECRET_KEY || '',
  scoreThreshold: 0.5, // Minimum score for passing
};

// Session Configuration
export const sessionConfig = {
  cookieName: 'albania_tours_session',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 30 * 24 * 60 * 60, // 30 days
};

// Content Security Policy Template
export const generateCSP = (env: string): string => {
  const scripts = ["'self'", "'unsafe-inline'", "'unsafe-eval'"];
  const styles = ["'self'", "'unsafe-inline'"];
  const images = ["'self'", 'data:', 'https:'];
  const connect = ["'self'", 'https://api.stripe.com'];
  const fonts = ["'self'", 'data:'];
  const frameAncestors = ["'none'"];
  
  return [
    `default-src ${scripts.join(' ')};`,
    `script-src ${scripts.join(' ')};`,
    `style-src ${styles.join(' ')};`,
    `img-src ${images.join(' ')};`,
    `font-src ${fonts.join(' ')};`,
    `connect-src ${connect.join(' ')};`,
    `frame-ancestors ${frameAncestors.join(' ')};`,
    `base-uri 'self';`,
    `form-action 'self';`,
  ].join(' ');
};
