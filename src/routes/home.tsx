import { auth } from "../firebase";

export function Home() {
  const logout = () => {
    auth.signOut();
  };
  return (
    <div>
      <h1>Home</h1>
      <button onClick={logout}>Log Out</button>
    </div>
  );
}
