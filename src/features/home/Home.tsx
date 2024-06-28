import React from "react";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import { AiFillGithub, AiFillLinkedin, AiFillInstagram } from "react-icons/ai";
import Slider from "../../components/slider/Slider";
import styles from "./Home.module.scss";
import logo from "../../assets/logo.png";

const url = (name: string) =>
    `https://awv3node-homepage.surge.sh/build/assets/${name}.svg${""}`;

const Home = () => {
    return (
        <Parallax pages={10}>
            <ParallaxLayer offset={0} speed={0.5}>
                <div className={styles.container}>
                    <Slider />
                </div>
            </ParallaxLayer>
            <ParallaxLayer offset={1} className={styles.fg} />
            <ParallaxLayer offset={2} className={styles.fg} />
            <ParallaxLayer offset={3} className={styles.fg} />
            <ParallaxLayer offset={4} className={styles.fg} />
            <ParallaxLayer offset={5} className={styles.fg} />
            <ParallaxLayer
                sticky={{ start: 1, end: 5 }}
                className={styles.text}
            >
                Welcome to my page :)
            </ParallaxLayer>
            <ParallaxLayer sticky={{ start: 3.2, end: 5 }}>
                <img
                    src={logo}
                    alt="logo"
                    style={{
                        width: "4%",
                        opacity: "0.8",
                        margin: "5px",
                    }}
                />
            </ParallaxLayer>
            <ParallaxLayer sticky={{ start: 2, end: 5 }} speed={1.5}>
                <img
                    src={url("cloud")}
                    alt="cloud"
                    style={{
                        width: "15%",
                        marginLeft: "20%",
                        marginTop: "10%",
                        opacity: "0.1",
                    }}
                />
            </ParallaxLayer>
            <ParallaxLayer sticky={{ start: 2.8, end: 5 }} speed={1.5}>
                <img
                    src={url("cloud")}
                    alt="cloud"
                    style={{
                        width: "15%",
                        marginLeft: "10%",
                        marginTop: "5%",
                        opacity: "0.1",
                    }}
                />
            </ParallaxLayer>
            <ParallaxLayer sticky={{ start: 3.5, end: 5 }} speed={1.5}>
                <img
                    src={url("cloud")}
                    alt="cloud"
                    style={{
                        width: "15%",
                        marginLeft: "7%",
                        marginTop: "12%",
                        opacity: "0.1",
                    }}
                />
            </ParallaxLayer>
            <ParallaxLayer
                sticky={{ start: 2, end: 5 }}
                speed={1.5}
                style={{ pointerEvents: "none" }}
            >
                <div
                    className={styles.item}
                    style={{
                        float: "right",
                        marginRight: "3rem",
                        marginTop: "-225px",
                        top: "50%",
                        pointerEvents: "all",
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        console.log("About");
                    }}
                >
                    About
                </div>
            </ParallaxLayer>
            <ParallaxLayer
                sticky={{ start: 3, end: 5 }}
                speed={1.5}
                style={{ pointerEvents: "none" }}
            >
                <div
                    className={styles.item}
                    style={{
                        float: "right",
                        marginRight: "3rem",
                        marginTop: "-50px",
                        top: "50%",
                        pointerEvents: "all",
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        console.log("Resume");
                    }}
                >
                    Resume
                </div>
            </ParallaxLayer>

            <ParallaxLayer
                sticky={{ start: 4, end: 5 }}
                speed={1.5}
                style={{ pointerEvents: "none" }}
            >
                <div
                    className={styles.item}
                    style={{
                        float: "right",
                        marginRight: "3rem",
                        marginTop: "125px",
                        top: "50%",
                        pointerEvents: "all",
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        console.log("Contact");
                    }}
                >
                    Contact
                </div>
            </ParallaxLayer>

            <ParallaxLayer
                sticky={{ start: 6, end: 9 }}
                className={styles.text}
                style={{ color: "#393635" }}
            >
                Check out my socials
            </ParallaxLayer>
            <ParallaxLayer
                sticky={{ start: 7, end: 9 }}
                className={styles.iconContainerOuter}
            >
                <div
                    className={styles.iconContainerInner}
                    style={{ marginRight: "15rem" }}
                >
                    <a
                        href="https://www.linkedin.com/in/cyangnouvong/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <AiFillLinkedin
                            className={styles.icon}
                            size={"4rem"}
                            title="LinkedIn"
                        />
                    </a>
                </div>
            </ParallaxLayer>
            <ParallaxLayer
                sticky={{ start: 8, end: 9 }}
                className={styles.iconContainerOuter}
            >
                <div className={styles.iconContainerInner}>
                    <a
                        href="https://www.instagram.com/cdaoyang/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <AiFillInstagram
                            className={styles.icon}
                            size={"4rem"}
                            title="Instagram"
                        />
                    </a>
                </div>
            </ParallaxLayer>
            <ParallaxLayer
                sticky={{ start: 9, end: 9 }}
                className={styles.iconContainerOuter}
            >
                <div
                    className={styles.iconContainerInner}
                    style={{ marginLeft: "15rem" }}
                >
                    <a
                        href="https://github.com/cyangnouvong"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <AiFillGithub
                            className={styles.icon}
                            size={"4rem"}
                            title="GitHub"
                        />
                    </a>
                </div>
            </ParallaxLayer>
        </Parallax>
    );
};

export default Home;
