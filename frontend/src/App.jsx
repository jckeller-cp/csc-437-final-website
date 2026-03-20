import { Routes, Route, useNavigate } from "react-router";
import { useState } from "react";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Playlists from "./pages/Playlists";
import Setlists from "./pages/Setlists";
import Account from "./pages/Account";
import PlaylistDetail from "./pages/PlaylistDetail";
import SetlistDetail from "./pages/SetlistDetail";
import { ProtectedRoute } from "./ProtectedRoute";
import { VALID_ROUTES } from "../../shared/ValidRoutes";
import { MainLayout } from "./MainLayout";

function App() {
  const [authToken, setAuthToken] = useState(null);
  const navigate = useNavigate();

  function onLogin(token) {
    setAuthToken(token);
    navigate("/", { replace: true });
  }

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route
          path={VALID_ROUTES.HOME}
          element={
            <ProtectedRoute authToken={authToken}>
              <Home authToken={authToken} />
            </ProtectedRoute>
          }
        />
        <Route
          path={VALID_ROUTES.LOGIN}
          element={<Login isRegistering={false} onLogin={onLogin} />}
        />
        <Route
          path={VALID_ROUTES.REGISTER}
          element={<Login isRegistering={true} onLogin={onLogin} />}
        />
        <Route
          path={VALID_ROUTES.PLAYLISTS}
          element={
            <ProtectedRoute authToken={authToken}>
              <Playlists authToken={authToken} />
            </ProtectedRoute>
          }
        />
        <Route
          path={VALID_ROUTES.PLAYLIST_DETAILS}
          element={
            <ProtectedRoute authToken={authToken}>
              <PlaylistDetail authToken={authToken} />
            </ProtectedRoute>
          }
        />
        <Route
          path={VALID_ROUTES.SETLISTS}
          element={
            <ProtectedRoute authToken={authToken}>
              <Setlists authToken={authToken} />
            </ProtectedRoute>
          }
        />
        <Route
          path={VALID_ROUTES.SETLIST_DETAILS}
          element={
            <ProtectedRoute authToken={authToken}>
              <SetlistDetail authToken={authToken} />
            </ProtectedRoute>
          }
        />
        <Route
          path={VALID_ROUTES.ACCOUNT}
          element={
            <ProtectedRoute authToken={authToken}>
              <Account authToken={authToken} />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
