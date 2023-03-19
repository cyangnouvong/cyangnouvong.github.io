import "./components/styles/App.css";
import { Routes, Route, HashRouter } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/home";

//const About = lazy(() => import('./pages/About'));

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
      </HashRouter>
    </div>
  );
}

export const changeTitle = (title) => {
  useEffect(() => {
    document.title = title;
  }, []);
}

export default App;
