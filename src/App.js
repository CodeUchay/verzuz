import Add from './components/Add';
import Admin from './components/Admin';
import Footer from './components/Footer';
import Home from './components/Home';
import Vote from './components/Vote';
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
       <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<Add />} />
        <Route path="/vote/:id" element={<Vote />} />
        <Route path="/admin" element={<Admin />} />
        
      </Routes>
      <Footer/>
      </>
  );
}

export default App;
