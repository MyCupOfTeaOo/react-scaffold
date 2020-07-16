import React, { useEffect } from 'react';
import { useValue } from 'teaness';
import styles from './index.scss';
import { projectName } from '#/projectConfig';

interface TitleProps {}

const Title: React.FC<TitleProps> = () => {
  const title = useValue(projectName);
  useEffect(() => {
    title.setValue(document.title);
    function changeTitle() {
      title.setValue(document.title);
    }
    document.addEventListener('changeTitle', changeTitle);
    return document.removeEventListener('changeTitle', changeTitle);
  }, []);
  return <div className={styles.title}>{title.value}</div>;
};

export default Title;
