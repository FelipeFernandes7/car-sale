import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import { auth } from "../../services/firebase";

export function PanelHeader() {
  async function handleLogout() {
    await signOut(auth);
  }
  
  return (
    <div className="w-full flex items-center h-11 bg-white text-black font-medium gap-4 drop-shadow-md px-4 rounded-lg mb-4">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/dashboard/new">Cadastrar carro</Link>
      <button className="ml-auto text-black" onClick={handleLogout}>
        Sair da conta
      </button>
    </div>
  );
}
