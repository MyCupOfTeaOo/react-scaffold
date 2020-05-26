import React from 'react';
import { injectProps } from '../decorators';

interface TestProps {
  title: string;
  subTitle?: string;
}

const TestFunc: React.FC<TestProps> = props => {
  return <div>{props.title}</div>;
};

const TestFuncDecorated = injectProps<TestProps>({ title: '123' })(TestFunc);

const Test1: React.FC<any> = () => {
  return <TestFuncDecorated title="test" />;
};

@injectProps<TestProps>({ title: '123' })
class TestCom extends React.PureComponent<TestProps> {
  render() {
    return <div>{this.props.title}</div>;
  }
}

const Test2: React.FC<any> = () => {
  return <TestCom title="test" />;
};

export { Test1, Test2 };
