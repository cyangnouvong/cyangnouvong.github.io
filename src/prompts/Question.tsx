import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material";
import { useState } from "react";

const Question = () => {
    const [condition, setCondition] = useState("");

    const theme = createTheme({
        palette: {
            primary: {
                main: "#ebe2df",
            },
        },
        typography: {
            button: {
                textTransform: "none",
            },
        },
    });
    return (
        <ThemeProvider theme={theme}>
            <section>
                <h1>so...</h1>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "20px",
                    }}
                >
                    <Button
                        onClick={() => {
                            setCondition("YES");
                            document.title = ":)";
                        }}
                    >
                        Yes
                    </Button>
                    <Button
                        onClick={() => {
                            setCondition("NO");
                            document.title = ":(";
                        }}
                    >
                        No :(
                    </Button>
                </div>
                {condition === "YES" && (
                    <img
                        src={require("../assets/yes.gif")}
                        alt="yes"
                        id="yes"
                        style={{ position: "absolute" }}
                        onClick={() => setCondition("")}
                    />
                )}
                {condition === "NO" && (
                    <img
                        src={require("../assets/no.gif")}
                        alt="no"
                        style={{ position: "absolute" }}
                        onClick={() => setCondition("")}
                    />
                )}
            </section>
        </ThemeProvider>
    );
};

export default Question;
