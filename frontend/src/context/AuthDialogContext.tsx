import { createContext, useContext, useState } from 'react';

interface AuthDialogContextType {
  isOpen: boolean;
  openAuth: () => void;
  closeAuth: () => void;
}

const AuthDialogContext = createContext<AuthDialogContextType | null>(null);

export function AuthDialogProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AuthDialogContext.Provider value={{
      isOpen,
      openAuth: () => setIsOpen(true),
      closeAuth: () => setIsOpen(false),
    }}>
      {children}
    </AuthDialogContext.Provider>
  );
}

export function useAuthDialog() {
  const ctx = useContext(AuthDialogContext);
  if (!ctx) throw new Error('useAuthDialog must be used inside AuthDialogProvider');
  return ctx;
}