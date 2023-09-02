import clsx from 'clsx';

import Header from '../../components/Header';

import styles from './home.module.css';

const fadeIn = !sessionStorage.getItem('visited');
sessionStorage.setItem('visited', 'true');

const Home = () => {
    return (
        <>
            {fadeIn && <div className={styles.landingUnderlay}>Light up your life</div>}

            <Header className={clsx(fadeIn && styles.landingFade)} />
            <main className={clsx(styles.homePage, fadeIn && styles.landingFade)}>
                <section className={styles.aboutSection}>
                    <h2>This is some placeholder text</h2>
                    <p>This is some other placeholder text</p>
                </section>
            </main>
        </>
    );
};

export default Home;
