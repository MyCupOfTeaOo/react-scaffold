import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Circle } from 'teaness';
import store from './store';
import { bindType } from './decorator';

export interface TransComDictProps {
  code?: string;
  type: string;
  loading?: React.ReactNode;
  notFound?: React.ReactNode;
  errorFound?: React.ReactNode;
  notDiv?: boolean;
}

const TransComDict: React.FC<TransComDictProps> & {
  bindType: typeof bindType;
} = props => {
  const target = store.commonDictCache[props.type];
  useEffect(() => {
    store.setCacheByDictType(props.type);
  }, []);
  if (!props.code) return <span />;
  switch (target) {
    case 'loading':
      return <span>{props.loading || props.code}</span>;
    case 'error':
      return <span>{props.errorFound || props.code}</span>;
    case 'notFound':
      return <span>{props.notFound || props.code}</span>;
    default: {
      let element;
      if (target) {
        element =
          (target[props.code] && target[props.code].label) ||
          props.notFound ||
          props.code;
      } else {
        element = props.notFound || props.code;
      }
      if (props.notDiv) return <React.Fragment>{element}</React.Fragment>;
      return <span>{element}</span>;
    }
  }
};
TransComDict.defaultProps = {
  loading: (
    <Circle
      style={{
        width: '2rem',
      }}
    />
  ),
};

TransComDict.bindType = bindType;

export default observer(TransComDict);
