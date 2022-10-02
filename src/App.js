import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from './pages/Profile'
import './style.scss'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
function App() {

  const { currentUser } = useContext(AuthContext)

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />
    }
    return children
  }

  const ProtectedRouteLogin = ({ children }) => {
    if (currentUser) {
      return <Navigate to="/" />
    }
    return children
  }

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            <Route path="/register" element={
              <ProtectedRouteLogin>
                <Register />
              </ProtectedRouteLogin>
            } />

            <Route path="/login" element={
              <ProtectedRouteLogin>
                <Login />
              </ProtectedRouteLogin>}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
