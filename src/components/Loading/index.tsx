import React, { useEffect } from 'react';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';

export interface LoadingProps {}

const Loading: React.FC<LoadingProps> = () => {
  useEffect(() => {
    nprogress.start();
    return () => {
      nprogress.done();
    };
  }, []);
  return <div />;
};

// 为了解决 umi 的错误声明
export default (Loading as any) as React.Component;
