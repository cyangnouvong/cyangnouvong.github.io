import React, { useEffect, useState } from "react";
import { AiFillCaretRight } from "react-icons/ai";
import { AiFillCaretLeft } from "react-icons/ai";
import Button from "@mui/material/Button";
import PromptOne from "./prompts/PromptOne";
import PromptTwo from "./prompts/PromptTwo";
import PromptThree from "./prompts/PromptThree";
import PromptFour from "./prompts/PromptFour";
import PromptFive from "./prompts/PromptFive";
import PromptSix from "./prompts/PromptSix";
import Title from "./prompts/Title";
import Question from "./prompts/Question";
import "./App.scss";
import { createTheme, ThemeProvider } from "@mui/material";

const App = () => {
    const [prompt, setPrompt] = useState(0);
    const firstPageNumber = 0;
    const lastPageNumber = 7;

    const map = new Map([
        [0, <Title />],
        [1, <PromptOne />],
        [2, <PromptTwo />],
        [3, <PromptThree />],
        [4, <PromptFour />],
        [5, <PromptFive />],
        [6, <PromptSix />],
        [7, <Question />],
    ]);

    const theme = createTheme({
        palette: {
            primary: {
                main: "#ebe2df",
            },
        },
    });

    useEffect(() => {
        document.title = ":)";
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <div className="container">
                {prompt > firstPageNumber && (
                    <Button
                        onClick={() => setPrompt(prompt - 1)}
                        style={{ minWidth: "50px", marginLeft: "10px" }}
                    >
                        <AiFillCaretLeft size="30px" color="#ebe2df" />
                    </Button>
                )}
                {map.get(prompt)}
                {prompt < lastPageNumber && (
                    <Button
                        onClick={() => setPrompt(prompt + 1)}
                        style={{ minWidth: "50px", marginRight: "10px" }}
                    >
                        <AiFillCaretRight size="30px" color="#ebe2df" />
                    </Button>
                )}
            </div>
        </ThemeProvider>
    );
};

export default App;
