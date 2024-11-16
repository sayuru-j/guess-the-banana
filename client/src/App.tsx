import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./components/pages/Login";
import PlayPage from "./components/pages/Play";
import LevelSelect from "./components/pages/Level";
import Gameplay from "./components/pages/Gameplay";
import Leaderboard from "./components/pages/Leaderboard";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/play" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/play" element={<PlayPage />} />
            <Route path="/level-select" element={<LevelSelect />} />
            <Route path="/gameplay/:level" element={<Gameplay />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
