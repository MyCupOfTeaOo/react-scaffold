import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Circle } from 'teaness';
import store from './store';
import { separator, getTarget } from './utils';

/* eslint-disable no-nested-ternary */

export interface TransCasDictProps {
  code?: string;
  type: string;
  loading?: React.ReactNode;
  notFound?: React.ReactNode;
  errorFound?: React.ReactNode;
  separator?: string;
  joinFather?: boolean;
  showIndex?: number;
  rootIndex?: number;
  notDiv?: boolean;
}

const TransCasDict: React.FC<TransCasDictProps> = props => {
  const target = getTarget(
    props.code,
    store.cascaderCache[props.type],
    props.joinFather,
  );
  useEffect(() => {
    if (props.code && props.type) {
      store.setCacheByDictTypeAndDictCode(
        props.type,
        props.code,
        props.joinFather,
      );
    }
  }, [props.code, props.type, props.joinFather]);
  switch (target.state) {
    case 'loading':
      return <span>{props.loading || props.code}</span>;
    case 'error':
      return <span>{props.errorFound || props.code}</span>;
    case 'notFound':
      return <span>{props.notFound || props.code}</span>;
    default: {
      const element =
        target.labels && target.labels.length > 0
          ? props.showIndex
            ? target.labels?.[props.showIndex] ?? (props.notFound || props.code)
            : target.labels
                .splice(
                  props.rootIndex || 0,
                  target.labels.length - (props.rootIndex || 0),
                )
                .join(props.separator)
          : props.notFound || props.code;
      if (props.notDiv) return <React.Fragment>{element}</React.Fragment>;
      return <span>{element}</span>;
    }
  }
};
TransCasDict.defaultProps = {
  separator,
  joinFather: false,
  loading: (
    <Circle
      style={{
        width: '1.5rem',
      }}
    />
  ),
};

export default observer(TransCasDict);
