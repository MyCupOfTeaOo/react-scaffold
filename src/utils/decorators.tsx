import React from 'react';

export function injectProps<T extends {}>(props?: Partial<T>) {
  return function<P extends T, S extends {}>(
    WrappedComponent: React.ComponentType<P>,
  ) {
    return class Component extends React.PureComponent<P, S> {
      render() {
        return <WrappedComponent {...props} {...this.props} />;
      }
    };
  };
}
