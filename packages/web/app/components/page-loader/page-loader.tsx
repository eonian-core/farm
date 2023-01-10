import React from 'react'
import Spinner from '../spinner/spinner';

const PageLoader = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner size={40} />
    </div>
  );
};

export default PageLoader;