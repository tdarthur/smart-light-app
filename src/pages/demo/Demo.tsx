import styles from './demo.module.css';
import useScrollPosition from '../../hooks/useScrollPosition';

const Demo = () => {
    const scrollPosition = useScrollPosition();

    return <div className={styles.demo} style={{ opacity: scrollPosition / window.innerHeight }} />;
};

export default Demo;
