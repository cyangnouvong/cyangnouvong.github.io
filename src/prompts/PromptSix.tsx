const PromptSix = () => {
    return (
        <section>
            <h1>Sakhu will be happy</h1>
            <p>boop</p>
            <img
                src={require("../assets/sakhu.jpg")}
                alt="sakhu"
                width={"200px"}
                height={"200px"}
                className="rotate"
                style={{
                    position: "absolute",
                    right: window.innerWidth / 2 - 300,
                    bottom: window.innerHeight / 2 - 250,
                }}
            />
        </section>
    );
};

export default PromptSix;
