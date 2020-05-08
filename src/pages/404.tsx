import React from 'react';
import { Result, Button } from 'antd';
import router from 'umi/router';

export default function() {
  return (
    <Result
      status={('404' as any) as 404}
      title="404"
      subTitle="找不到该页面,请返回或回到首页"
      extra={
        <React.Fragment>
          <Button type="primary" onClick={() => router.push('/')}>
            回到首页
          </Button>
          <Button type="primary" onClick={() => router.goBack()}>
            返回上一页
          </Button>
        </React.Fragment>
      }
    />
  );
}
