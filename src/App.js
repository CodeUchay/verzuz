import Add from './components/Add';
import Home from './components/Home';
import Vote from './components/Vote';
import logo from './logo.svg';
import { Route, Routes } from "react-router-dom";

function App() {
  return (
       <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<Add />} />
        {/* main menu and single menu */}
        <Route path="/vote/:id" element={<Vote />} />
      </Routes>
  );
}

export default App;
