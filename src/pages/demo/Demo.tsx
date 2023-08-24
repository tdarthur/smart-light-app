import { lazy } from 'react';
import styles from './demo.module.css';
import useScrollPosition from '../../hooks/useScrollPosition';

const LazySpline = lazy(() => import('@splinetool/react-spline'));

const Demo = () => {
    const scrollPosition = useScrollPosition();

    return (
        <div className={styles.demo} style={{ opacity: scrollPosition / window.innerHeight }}>
            <LazySpline scene="https://prod.spline.design/5ar9EaBHYxKDJ34t/scene.splinecode" />
        </div>
    );
};

export default Demo;
