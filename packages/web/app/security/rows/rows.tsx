import React from 'react';
import styles from './rows.module.scss';

// Props for columns
export interface RowsProps {
    children: React.ReactNode
}

// Two colunms layout
export const Rows = ({children}: RowsProps) => (
    <div className={styles.row}>
        {children}
    </div>
);

export default Rows;

