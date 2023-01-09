import React from 'react';

import '../app/globals.scss';
import '../app/tailwind.css'

// Simple hack to add globasl styles to all stories
export const WithGlobalStyles = ({ children }) => (
    <>
        {children}
    </>
);

export default WithGlobalStyles;