import type { ComponentProps } from 'react';
import clsx from 'clsx';

import styles from './components.module.css';

const Header = ({ className, ...props }: ComponentProps<'header'>) => (
    <header className={clsx(styles.header, className)} {...props}>
        <div className={styles.headerLogo}>Illuminous</div>
    </header>
);

export default Header;
