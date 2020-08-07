import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import classnames from 'classnames';
import styles from './MaskLoading.scss';

export interface MaskLoadingProps {
  open?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const MaskLoading: React.FC<MaskLoadingProps> = ({
  open = false,
  children,
  className,
  style,
}) => {
  return (
    <Backdrop
      style={style}
      className={classnames(styles.backdrop, className)}
      open={open}
    >
      {children && <span className={styles.content}>{children}</span>}
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default MaskLoading;
