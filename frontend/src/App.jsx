import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoutes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notification";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/feed" element={<Feed />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route
            path="/profile/:username"
            element={<Profile />}
          />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route
            path="/notifications"
            element={<Notifications />}
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;