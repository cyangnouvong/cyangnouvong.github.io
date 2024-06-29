import styles from "./PageNotFound.module.scss";
import Slider from "../components/slider/Slider";

const PageNotFound = () => {
    return (
        <div className={styles.container}>
            <Slider title={"404"} />
        </div>
    );
};

export default PageNotFound;
