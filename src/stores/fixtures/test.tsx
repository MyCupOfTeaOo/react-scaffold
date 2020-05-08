import React from 'react';
import { inject } from 'mobx-react';
import { RouteProps } from '@/typings';
import Global from '../Global';

/* eslint-disable func-names,prefer-arrow-callback,no-console,@typescript-eslint/no-unused-vars */

inject<{ global: Global }>(({ global }) => ({
  global,
}))<RouteProps>(function(props) {
  console.log(props.global);
  return <div>11</div>;
});

@inject<{ global: Global }>(({ global }) => ({
  global,
}))
class Test extends React.Component<{ global: Global } & RouteProps> {
  render() {
    console.log(this.props.global);
    return <div>1</div>;
  }
}

inject<{ global: Global }>('global')<RouteProps>(function(props) {
  console.log(props.global);
  return <div>11</div>;
});

@inject<{ global: Global }>('global')
class Test2 extends React.Component<{ global: Global } & RouteProps> {
  render() {
    console.log(this.props.global);
    return <div>1</div>;
  }
}

inject<{ global: Global }>(['global'])<RouteProps>(function(props) {
  console.log(props.global);
  return <div>11</div>;
});
