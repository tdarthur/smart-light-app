import useScrollPosition from '../../hooks/useScrollPosition';

import styles from './landing.module.css';

const Landing = () => {
    const scrollPosition = useScrollPosition();

    return (
        <div className={styles.landing} style={{ opacity: 1 - scrollPosition / window.innerHeight }}>
            <div className={styles.landingSpotlight} />
            <div className={styles.landingPointlight} />

            <div className={styles.landingText}>
                <h2>Light up your life with</h2>
                <h1>Illuminous</h1>
            </div>
            <div className={styles.landingActionText}>Check out our products below</div>
        </div>
    );
};

export default Landing;
