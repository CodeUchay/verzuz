import CreateBattle from './components/front/CreateBattle';
import Admin from './components/back/Admin';
import Footer from './components/Footer';
import Home from './components/front/Home';
import Vote from './components/front/Vote';
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
       <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<CreateBattle />} />
        <Route path="/vote/:id" element={<Vote />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Footer />
      </>
  );
}

export default App;
