import React, { useCallback, useMemo } from 'react';
import router from 'umi/router';
import { Result, Button } from 'antd';

export default function() {
  const push = useCallback(() => {
    router.push('/');
  }, []);
  const goback = useCallback(() => {
    router.goBack();
  }, []);
  const back = useMemo(
    () => (
      <React.Fragment>
        <Button type="primary" onClick={push}>
          回到首页
        </Button>
        <Button type="primary" onClick={goback}>
          返回上一页
        </Button>
      </React.Fragment>
    ),
    [],
  );
  return (
    <Result
      status="warning"
      title="501"
      subTitle="该页面正在开发中"
      extra={back}
    />
  );
}
