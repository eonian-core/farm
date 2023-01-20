import React from 'react';
import styles from './rows.module.scss';

// Props for columns
export interface RowProps {
    children: React.ReactNode
}

// Two colunms layout
export const Row = ({children}: RowProps) => (
    <div className={styles.row}>
        {children}
    </div>
);

export default Row;

