import { Outlet } from "react-router";
import { Header } from "./Header.jsx";

export function MainLayout() {
  return (
    <div>
      <Header />
      <main style={{ padding: "0 2em" }}>
        <Outlet />
      </main>
    </div>
  );
}
