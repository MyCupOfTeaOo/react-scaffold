import React from 'react';
import Title from './Title';
import styles from './index.scss';
import Control from './Control';

interface TitleBar {}

const TitleBar: React.FC<TitleBar> = () => {
  return (
    <div className={styles.container}>
      <div className={styles.drag} />
      <Title />
      <Control />
    </div>
  );
};

export default TitleBar;
