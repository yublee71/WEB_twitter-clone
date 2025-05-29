import { auth } from "../firebase";
import { useNavigate } from "react-router";

export function Home() {
  const navigate = useNavigate();
  const logout = () => {
    auth.signOut();
    navigate("/login");
  };
  return (
    <div>
      <h1>Home</h1>
      <button onClick={logout}>Log Out</button>
    </div>
  );
}
