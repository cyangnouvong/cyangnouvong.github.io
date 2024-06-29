import styles from "./Navigation.module.scss";

interface NavigationProps {
    title: string;
    goToHome: () => void;
    goToAbout: () => void;
    goToResume: () => void;
    goToContact: () => void;
}

const Navigation = (props: NavigationProps) => {
    return (
        <>
            <div className={styles.container}>
                <div
                    className={styles.item}
                    onClick={() => {
                        props.goToHome();
                    }}
                >
                    Home
                </div>
                <div
                    className={
                        props.title === "About"
                            ? styles.itemSelected
                            : styles.item
                    }
                    onClick={() => {
                        props.goToAbout();
                    }}
                >
                    About
                </div>
                <div
                    className={
                        props.title === "Resume"
                            ? styles.itemSelected
                            : styles.item
                    }
                    onClick={() => {
                        props.goToResume();
                    }}
                >
                    Resume
                </div>
                <div
                    className={
                        props.title === "Contact"
                            ? styles.itemSelected
                            : styles.item
                    }
                    onClick={() => {
                        props.goToContact();
                    }}
                >
                    Contact
                </div>
            </div>
        </>
    );
};

export default Navigation;
