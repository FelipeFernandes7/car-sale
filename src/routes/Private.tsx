import { ReactNode, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

interface PrivateProps {
  children: ReactNode;
}

export function Private({ children }: PrivateProps) {
  const { signed, loadingAuth } = useContext(AuthContext);
  if (loadingAuth) {
    return (
      <div>
        <h1>carregando...</h1>
      </div>
    );
  }
  if (!signed) {
    return <Navigate to={"/login"} />;
  }
  return children;
}
