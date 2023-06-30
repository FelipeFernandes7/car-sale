import { onAuthStateChanged } from "firebase/auth";
import { ReactNode, createContext, useState, useEffect } from "react";
import { auth } from "../services/firebase";

interface AuthProviderProps {
  children: ReactNode;
}

type AuthContextType = {
  user: UserProps | null;
  signed: boolean;
  loadingAuth: boolean;
  handleInfoUser: ({ uid, name, email }: UserProps) => void;
};

interface UserProps {
  uid: string;
  name: string | null;
  email: string | null;
}

export const AuthContext = createContext({} as AuthContextType);
function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          name: user.displayName,
        });
        setLoadingAuth(false);
      } else {
        setUser(null);
        setLoadingAuth(false);
      }
    });

    return () => {
      unsub();
    };
  }, []);

  function handleInfoUser({ name, email, uid }: UserProps) {
    setUser({
      uid,
      name,
      email,
    });
  }

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, loadingAuth, handleInfoUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export default AuthProvider;
