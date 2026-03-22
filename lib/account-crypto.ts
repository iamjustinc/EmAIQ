/** Client-only SHA-256 for demo password/passcode storage (not a substitute for server auth). */
export async function sha256Hex(message: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    return '';
  }
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(message));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export const ACCOUNT_LS = {
  primaryEmail: 'emaiq-primary-email',
  connectedAccounts: 'emaiq-connected-accounts',
  passcodeHash: 'emaiq-passcode-hash',
  passcodeEnabled: 'emaiq-passcode-enabled',
  twoFactor: 'emaiq-2fa',
  passwordHash: 'emaiq-password-hash',
  passwordChangedAt: 'emaiq-password-changed-at',
} as const;
