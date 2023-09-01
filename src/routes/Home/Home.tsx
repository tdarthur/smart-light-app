import Header from '../../components/Header';
import styles from './home.module.css';

const Home = () => {
    return (
        <>
            <Header />
            <div className={styles.landingOverlay}>Light up your life</div>
            <main className={styles.homePage}>
                <section className={styles.aboutSection}>
                    <h2>This is some placeholder text</h2>
                    <p>This is some other placeholder text</p>
                </section>
            </main>
        </>
    );
};

export default Home;
