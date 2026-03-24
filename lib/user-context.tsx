'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ACCOUNT_LS, sha256Hex } from '@/lib/account-crypto';

export type ConnectedAccount = { id: string; email: string };

interface UserContextType {
  firstName: string;
  setFirstName: (name: string) => void;

  primaryEmail: string;
  setPrimaryEmail: (email: string) => void;

  connectedAccounts: ConnectedAccount[];
  addConnectedAccount: (email: string) => { ok: boolean; error?: string };
  removeConnectedAccount: (id: string) => void;

  passcodeEnabled: boolean;
  setPasscodeEnabled: (enabled: boolean) => void;
  hasPasscode: boolean;
  setPasscode: (pin: string) => Promise<{ ok: boolean; error?: string }>;
  changePasscode: (currentPin: string, newPin: string) => Promise<{ ok: boolean; error?: string }>;
  verifyPasscode: (pin: string) => Promise<boolean>;
  clearPasscode: () => void;

  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (v: boolean) => void;

  hasPassword: boolean;
  passwordLastChanged: string | null;
  changePassword: (args: {
    current?: string;
    next: string;
    confirm: string;
  }) => Promise<{ ok: boolean; error?: string }>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

function defaultEmailFromName(name: string) {
  const slug = name.trim().toLowerCase().replace(/\s+/g, '.') || 'examle';
  return `${slug}.name@example.com`;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [firstName, setFirstNameState] = useState('Example');
  const [primaryEmail, setPrimaryEmailState] = useState('name@example.com');
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);

  const [passcodeEnabled, setPasscodeEnabledState] = useState(false);
  const [passcodeHash, setPasscodeHash] = useState<string | null>(null);

  const [twoFactorEnabled, setTwoFactorEnabledState] = useState(false);

  const [passwordHash, setPasswordHash] = useState<string | null>(null);
  const [passwordLastChanged, setPasswordLastChanged] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedName = localStorage.getItem('user-first-name');
      if (savedName) setFirstNameState(savedName);

      const nameForEmail = savedName || 'Example';
      const savedEmail = localStorage.getItem(ACCOUNT_LS.primaryEmail);
      if (savedEmail) setPrimaryEmailState(savedEmail);
      else {
        const def = defaultEmailFromName(nameForEmail);
        setPrimaryEmailState(def);
        localStorage.setItem(ACCOUNT_LS.primaryEmail, def);
      }

      const rawConn = localStorage.getItem(ACCOUNT_LS.connectedAccounts);
      if (rawConn) {
        const parsed = JSON.parse(rawConn) as ConnectedAccount[];
        if (Array.isArray(parsed)) setConnectedAccounts(parsed);
      }

      const pcHash = localStorage.getItem(ACCOUNT_LS.passcodeHash);
      setPasscodeHash(pcHash);

      const pcEn = localStorage.getItem(ACCOUNT_LS.passcodeEnabled);
      setPasscodeEnabledState(pcEn === 'true');

      const t2 = localStorage.getItem(ACCOUNT_LS.twoFactor);
      setTwoFactorEnabledState(t2 === 'true');

      const pwHash = localStorage.getItem(ACCOUNT_LS.passwordHash);
      setPasswordHash(pwHash);

      const pwAt = localStorage.getItem(ACCOUNT_LS.passwordChangedAt);
      setPasswordLastChanged(pwAt);
    } catch {
      // ignore corrupt localStorage
    }
  }, []);

  const setFirstName = useCallback((name: string) => {
    setFirstNameState(name);
    localStorage.setItem('user-first-name', name);
  }, []);

  const setPrimaryEmail = useCallback((email: string) => {
    const trimmed = email.trim();
    setPrimaryEmailState(trimmed);
    localStorage.setItem(ACCOUNT_LS.primaryEmail, trimmed);
  }, []);

  const persistConnected = useCallback((next: ConnectedAccount[]) => {
    setConnectedAccounts(next);
    localStorage.setItem(ACCOUNT_LS.connectedAccounts, JSON.stringify(next));
  }, []);

  const addConnectedAccount = useCallback(
    (email: string) => {
      const trimmed = email.trim().toLowerCase();
      if (!isValidEmail(trimmed)) {
        return { ok: false as const, error: 'Enter a valid email address.' };
      }
      if (trimmed === primaryEmail.trim().toLowerCase()) {
        return { ok: false as const, error: 'That address is already your primary account.' };
      }
      if (connectedAccounts.some((a) => a.email.toLowerCase() === trimmed)) {
        return { ok: false as const, error: 'That account is already connected.' };
      }
      const next: ConnectedAccount = {
        id: `acc_${Date.now().toString(36)}`,
        email: trimmed,
      };
      persistConnected([...connectedAccounts, next]);
      return { ok: true as const };
    },
    [connectedAccounts, persistConnected, primaryEmail],
  );

  const removeConnectedAccount = useCallback(
    (id: string) => {
      persistConnected(connectedAccounts.filter((a) => a.id !== id));
    },
    [connectedAccounts, persistConnected],
  );

  const setPasscodeEnabled = useCallback((enabled: boolean) => {
    setPasscodeEnabledState(enabled);
    localStorage.setItem(ACCOUNT_LS.passcodeEnabled, enabled ? 'true' : 'false');
    if (!enabled) {
      localStorage.removeItem(ACCOUNT_LS.passcodeHash);
      setPasscodeHash(null);
    }
  }, []);

  const verifyPasscode = useCallback(
    async (pin: string) => {
      if (!passcodeHash) return false;
      const hash = await sha256Hex(`passcode:${pin.replace(/\D/g, '')}`);
      return hash === passcodeHash;
    },
    [passcodeHash],
  );

  const setPasscode = useCallback(async (pin: string) => {
    const digits = pin.replace(/\D/g, '');
    if (digits.length < 4 || digits.length > 8) {
      return { ok: false as const, error: 'Use 4–8 digits for your passcode.' };
    }
    const hash = await sha256Hex(`passcode:${digits}`);
    if (!hash) {
      return { ok: false as const, error: 'Could not set passcode in this environment.' };
    }
    setPasscodeHash(hash);
    localStorage.setItem(ACCOUNT_LS.passcodeHash, hash);
    setPasscodeEnabledState(true);
    localStorage.setItem(ACCOUNT_LS.passcodeEnabled, 'true');
    return { ok: true as const };
  }, []);

  const changePasscode = useCallback(
    async (currentPin: string, newPin: string) => {
      const ok = await verifyPasscode(currentPin);
      if (!ok) {
        return { ok: false as const, error: 'Current passcode is incorrect.' };
      }
      return setPasscode(newPin);
    },
    [verifyPasscode, setPasscode],
  );

  const clearPasscode = useCallback(() => {
    setPasscodeHash(null);
    localStorage.removeItem(ACCOUNT_LS.passcodeHash);
    setPasscodeEnabledState(false);
    localStorage.setItem(ACCOUNT_LS.passcodeEnabled, 'false');
  }, []);

  const setTwoFactorEnabled = useCallback((v: boolean) => {
    setTwoFactorEnabledState(v);
    localStorage.setItem(ACCOUNT_LS.twoFactor, v ? 'true' : 'false');
  }, []);

  const changePassword = useCallback(
    async (args: { current?: string; next: string; confirm: string }) => {
      const { current, next, confirm } = args;
      if (next.length < 8) {
        return { ok: false as const, error: 'New password must be at least 8 characters.' };
      }
      if (next !== confirm) {
        return { ok: false as const, error: 'New password and confirmation do not match.' };
      }
      if (passwordHash) {
        if (!current) {
          return { ok: false as const, error: 'Enter your current password.' };
        }
        const curHash = await sha256Hex(`pw:${current}`);
        if (curHash !== passwordHash) {
          return { ok: false as const, error: 'Current password is incorrect.' };
        }
      }
      const nextHash = await sha256Hex(`pw:${next}`);
      if (!nextHash) {
        return { ok: false as const, error: 'Could not update password in this environment.' };
      }
      setPasswordHash(nextHash);
      localStorage.setItem(ACCOUNT_LS.passwordHash, nextHash);
      const iso = new Date().toISOString();
      setPasswordLastChanged(iso);
      localStorage.setItem(ACCOUNT_LS.passwordChangedAt, iso);
      return { ok: true as const };
    },
    [passwordHash],
  );

  const hasPasscode = Boolean(passcodeHash);
  const hasPassword = Boolean(passwordHash);

  const value = useMemo(
    () => ({
      firstName,
      setFirstName,
      primaryEmail,
      setPrimaryEmail,
      connectedAccounts,
      addConnectedAccount,
      removeConnectedAccount,
      passcodeEnabled,
      setPasscodeEnabled,
      hasPasscode,
      setPasscode,
      changePasscode,
      verifyPasscode,
      clearPasscode,
      twoFactorEnabled,
      setTwoFactorEnabled,
      hasPassword,
      passwordLastChanged,
      changePassword,
    }),
    [
      firstName,
      setFirstName,
      primaryEmail,
      setPrimaryEmail,
      connectedAccounts,
      addConnectedAccount,
      removeConnectedAccount,
      passcodeEnabled,
      setPasscodeEnabled,
      hasPasscode,
      setPasscode,
      changePasscode,
      verifyPasscode,
      clearPasscode,
      twoFactorEnabled,
      setTwoFactorEnabled,
      hasPassword,
      passwordLastChanged,
      changePassword,
    ],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) throw new Error('useUser must be used within a UserProvider');
  return context;
}
