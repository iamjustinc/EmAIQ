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
  primaryEmail: 'quail-primary-email',
  connectedAccounts: 'quail-connected-accounts',
  passcodeHash: 'quail-passcode-hash',
  passcodeEnabled: 'quail-passcode-enabled',
  twoFactor: 'quail-2fa',
  passwordHash: 'quail-password-hash',
  passwordChangedAt: 'quail-password-changed-at',
} as const;
