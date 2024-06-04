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
import TextField from "@mui/material/TextField";
import { text } from "stream/consumers";

const App = () => {
    const [prompt, setPrompt] = useState(-1);
    const [password, setPassword] = useState("");
    const [passwordMet, setPasswordMet] = useState(false);
    const firstPageNumber = 0;
    const lastPageNumber = 7;
    const login = "omakase";

    const style = {
        "& .MuiOutlinedInput-root": {
            color: "#ebe2df",
            "& fieldset": {
                borderColor: "#ebe2df",
                text: "#ebe2df",
            },
            "&:hover fieldset": {
                borderColor: "#ebe2df",
                text: "#ebe2df",
            },
            "&.Mui-focused fieldset": {
                borderColor: "#ebe2df",
                text: "#ebe2df",
            },
        },
        "& .MuiInputLabel-outlined": {
            color: "#ebe2df",
        },
    };

    const PasswordField = () => {
        return (
            <TextField
                required
                id="outlined-required"
                label="Password"
                autoFocus
                onChange={(e) => {
                    setPassword(e.target.value);
                }}
                onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                        if (password === login) {
                            setPasswordMet(true);
                            setPrompt(prompt + 1);
                        }
                    }
                }}
                sx={style}
            />
        );
    };

    const map = new Map([
        [-1, PasswordField()],
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
                {prompt > firstPageNumber && passwordMet && (
                    <Button
                        onClick={() => setPrompt(prompt - 1)}
                        style={{ minWidth: "50px", marginLeft: "10px" }}
                    >
                        <AiFillCaretLeft size="30px" color="#ebe2df" />
                    </Button>
                )}
                {map.get(prompt)}
                {prompt < lastPageNumber && passwordMet && (
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
