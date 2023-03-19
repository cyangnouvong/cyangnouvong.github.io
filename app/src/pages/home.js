import portrait from "../components/images/self.png";
import circle from "../components/images/circle.png";
import terminaltemplate from "../components/images/terminal_template.png";
import "../components/styles/home.css"
import { changeTitle } from "../App"

const Home = () => {
    changeTitle("Chelsea Yangnouvong [WIP]");
    return (
        <div>
            <body>
                <div className="Image-Stack">
                    <img src={terminaltemplate} className="Terminal-Image"/>
                    <img src={circle} className="Circle"/>
                    <img src={portrait} className="Self-Image"/>
                    <div className="Intro-Text">
                        <p>
                            Hi, I&#39;m Chelsea :) <br />
                            I&#39;m a Developer.
                        </p>
                    </div>
                </div>
            </body>
        </div>
    );
}

export default Home;