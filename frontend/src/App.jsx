import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoutes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/feed" element={<Feed />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;