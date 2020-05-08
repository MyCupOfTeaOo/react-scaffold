import React from 'react';
import { RouteProps } from '@/typings';
import { AuthContext } from './context';

export const AuthRoutes: React.FC<RouteProps> = props => {
  return (
    <AuthContext.Provider
      value={{
        menuId: props.route && props.route.menuId,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export const bindMenuId = (menuId: string) => {
  return function<T>(WrappedComponent: React.ComponentType<T>) {
    return (props: T) => (
      <AuthContext.Provider value={{ menuId }}>
        <WrappedComponent {...props} />
      </AuthContext.Provider>
    );
  };
};
