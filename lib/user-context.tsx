'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserContextType {
  firstName: string;
  setFirstName: (name: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [firstName, setFirstName] = useState('Alex'); // Default name

  // Optional: Load name from localStorage so it persists on refresh
  useEffect(() => {
    const savedName = localStorage.getItem('user-first-name');
    if (savedName) setFirstName(savedName);
  }, []);

  const updateName = (name: string) => {
    setFirstName(name);
    localStorage.setItem('user-first-name', name);
  };

  return (
    <UserContext.Provider value={{ firstName, setFirstName: updateName }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) throw new Error('useUser must be used within a UserProvider');
  return context;
}
