import { Link } from "react-router-dom";
import { FiUser, FiLogIn } from "react-icons/fi";

import logoImg from "../../assets/logo-car.png";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export function Header() {
  const { loadingAuth, signed } = useContext(AuthContext);

  return (
    <div className="w-full flex items-center justify-center h-16 bg-white drop-shadow mb-4">
      <header className="flex w-full items-center justify-between max-w-7xl px-4 mx-auto">
        <Link to={"/"}>
          <img className="max-h-20 w-20" src={logoImg} alt="logo" />
        </Link>
        {!loadingAuth && signed && (
          <Link to={"/dashboard"}>
            <div className="border-2 rounded-full p-1 border-gray-900 ">
              <FiUser size={24} color="#000" cursor={"pointer"} />
            </div>
          </Link>
        )}
        {!loadingAuth && !signed && (
          <Link to={"/login"}>
            <FiLogIn size={24} color="#000" cursor={"pointer"} />
          </Link>
        )}
      </header>
    </div>
  );
}
