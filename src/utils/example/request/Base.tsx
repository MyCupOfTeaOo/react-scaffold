import React, { useCallback } from 'react';
import request from '@/utils/request';
import { useValue } from 'teaness';
import { Button, notification } from 'antd';

export interface BaseProps {}

const Base: React.FC<BaseProps> = () => {
  const loading = useValue(false);
  const req = useCallback(() => {
    loading.setValue(true);
    request.get('/test').then(res => {
      loading.setValue(false);
      if (res.isSuccess) {
        notification.success({
          message: '请求成功',
          description: JSON.stringify(res.data, undefined, 2),
        });
      } else if (!res.isCancel) {
        notification.error({
          message: '请求失败',
          description: res.msg,
        });
      }
    });
  }, []);
  return (
    <div>
      <Button onClick={req} loading={loading.value}>
        点击请求
      </Button>
    </div>
  );
};

export default Base;
