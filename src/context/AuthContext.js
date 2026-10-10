import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);

// Sessão do usuário
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const signIn = useCallback((nextSession) => setSession(nextSession), []);
  const signOut = useCallback(() => setSession(null), []);
  const value = useMemo(
    () => ({ session, signIn, signOut }),
    [session, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("O contexto de autenticação não está disponível.");
  }
  return context;
}
