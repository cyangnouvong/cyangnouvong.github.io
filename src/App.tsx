import React from "react";
import { Route, Routes, HashRouter } from "react-router-dom";
import Home from "./features/home/Home";
import styles from "./App.module.scss";
import PageNotFound from "./error/PageNotFound";

const App = () => {
    document.title = ":)";
    return (
        <div className={styles.container}>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/*" element={<PageNotFound />} />
                </Routes>
            </HashRouter>
        </div>
    );
};

export default App;
