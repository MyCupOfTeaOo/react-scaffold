import React from 'react';
import Title from './Title';
import styles from './index.scss';

interface TitleBar {}

const TitleBar: React.FC<TitleBar> = () => {
  return (
    <div className={styles.container}>
      <Title />
    </div>
  );
};

export default TitleBar;
