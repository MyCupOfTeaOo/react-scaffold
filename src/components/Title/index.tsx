import React, { useMemo } from 'react';
import { debounce } from 'lodash';
import { RouteProps } from '@/typings';

export const setTitle = debounce((title: string) => {
  document.title = title;
}, 100);

const Title: React.FC<RouteProps> = props => {
  useMemo(() => {
    setTitle(
      props.route && props.route.title ? props.route.title : document.title,
    );
  }, []);
  return <React.Fragment>{props.children}</React.Fragment>;
};

export default Title;
