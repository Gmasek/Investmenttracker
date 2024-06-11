import { BrowserRouter,Route,Routes,Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import "./index.css"

function Logout(){
  localStorage.clear()
  return <Navigate to="/login" />
}
function RegisterAndLogout(){
  localStorage.clear();
  return <Register />
}

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home >
              <Route path="/login" element={<Login />} />
            </Home>
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />}>
       
      </Route>
      <Route path="/logout" element={<Logout />} />
      <Route path="/register" element={<RegisterAndLogout />} />
      <Route path="*" element={<NotFound />}></Route>
    </Routes>
  </BrowserRouter>
  )
}

export default App

