import Add from './components/Add';
import Admin from './components/Admin';
import Home from './components/Home';
import Vote from './components/Vote';
import logo from './logo.svg';
import { Route, Routes } from "react-router-dom";

function App() {
  return (
       <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<Add />} />
        <Route path="/vote/:id" element={<Vote />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
  );
}

export default App;
