import React from 'react';
import { Route, Routes, HashRouter } from 'react-router-dom';
import BgParticles from './components/background/BgParticles';
import Navigation from './components/navigation/Navigation';
import Home from './features/home/Home';
import About from './features/About';
import Resume from './features/Resume';
import Socials from './components/socials/Socials';
import './App.scss';

const App = () => {
  return (
    <div className='container'>
        <HashRouter>
            <BgParticles />
            <Navigation />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/resume" element={<Resume />} />
            </Routes>
            <Socials />
        </HashRouter>
    </div>
    );
}

export default App;
