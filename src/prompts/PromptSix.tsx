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
                    right: "50%",
                    bottom: "50%",
                    marginRight: "-300px",
                    marginBottom: "-250px",
                }}
            />
        </section>
    );
};

export default PromptSix;
