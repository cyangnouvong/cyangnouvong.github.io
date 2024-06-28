import React, { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "react-use-gesture";
import styles from "./Slider.module.scss";

const left = {
    bg: `linear-gradient(120deg, #bad5ea 0%, #356d94 100%)`,
    justifySelf: "end",
    info: "I'm a software developer",
};

const right = {
    bg: `linear-gradient(120deg, #ac7a41 0%, #ffdcb3 100%)`,
    justifySelf: "start",
    info: "I'm Chelsea",
};

const Slider = () => {
    const [text, setText] = useState("");

    const [{ x, scale, bg, info }, api] = useSpring(() => ({
        x: 0,
        scale: 1,
        ...left,
    }));

    const bind = useDrag(({ active, movement: [x] }) => {
        api.start({
            x: active ? x : 0,
            scale: active ? 1.1 : 1,
            ...(x < 0 ? left : right),
            immediate: (name) => active && name === "x",
        });
        setText(x < 0 ? left.info : right.info);
    });

    return (
        <animated.div
            {...bind()}
            className={styles.item}
            style={{ background: bg }}
        >
            <div className={styles.text}>{text}</div>
            <animated.div className={styles.fg} style={{ x, scale }}>
                <div>
                    Hello.
                    <div style={{ fontSize: "0.7rem" }}>slide me!</div>
                </div>
            </animated.div>
        </animated.div>
    );
};

export default Slider;
