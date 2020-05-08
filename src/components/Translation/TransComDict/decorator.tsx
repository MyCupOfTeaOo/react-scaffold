import React from 'react';
import store from './store';

export const bindType = (dictType: string | string[]) => {
  if (Array.isArray(dictType)) {
    dictType.forEach(item => {
      store.setCacheByDictType(item);
    });
  } else store.setCacheByDictType(dictType);
  return function<T>(WrappedComponent: React.ComponentType<T>) {
    return (props: T) => <WrappedComponent {...props} />;
  };
};
