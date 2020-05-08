import React from 'react';
import TransComDict from '@/components/Translation/TransComDict';

// 使用方法1 通过bindType 装饰器加载type对应的字典集
// 该字典code cascadeType 会自动翻译成 级联字典类型
const YourPage = () => {
  return (
    <div>
      <TransComDict type="dictType" code="cascadeType" />
      <h1>
        测试字典翻译,结果应该是<code>级联字典类型</code>!
      </h1>
    </div>
  );
};
TransComDict.bindType('dictType')(YourPage);
