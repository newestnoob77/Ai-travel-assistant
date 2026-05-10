import {BrowserRouter,Routes,Route,Link} from "react-router-dom";
import { Home } from "./pages/Home";
import { Dashboard } from "./components/Dashboard";
import './App.css';

function App() {
  return (
     <BrowserRouter>
  <nav className="nav-bar">
    <div className="nav-left">
      <h2 className="nav-logo">AI Travel</h2>
    </div>

    <div className="nav-links">
      <Link className="nav-link" to="/">Home</Link>
      <Link className="nav-link" to="/dashboard">Dashboard</Link>
    </div>
  </nav>

  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
</BrowserRouter>
  );
}

export default App;
