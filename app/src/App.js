import './App.css';
import BgParticle from './components/BgParticles'
import Home from './pages/Home'
import About from './pages/About'
import Resume from './pages/Resume'
import Contact from './pages/Contact'
import { Route, Routes, HashRouter } from "react-router-dom";
import { useEffect } from "react";

function App() {
  return( 
    <div>
      <BgParticle />
      <Home />
    </div>
  );
}

export const ChangeTitle = (title) => {
  useEffect(() => {
    document.title = title;
  }, []);
}

export default App;

/*
    <HashRouter>
      <BgParticle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </HashRouter>
*/
