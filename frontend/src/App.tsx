import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Landing from "./pages/landing"
import Dashboard from "./pages/dashboard"
import { Login } from "./pages/login"

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
      </Routes>
    </Router>
  )
}

export default App
