import React from 'react';
import TransCasDict from '..';

// 使用方法
// 该字典code cascadeType 会自动翻译成 服务产品信息审核业
export const YourPage = () => {
  return (
    <div>
      <TransCasDict type="bizType" code="14-01" />
      <h1>
        测试字典翻译,结果应该是<code>服务产品信息审核业</code>!
      </h1>
    </div>
  );
};

// 如果你需要翻译带上父级 需要增加 joinFather,separator 的默认值是 - 你可以修改成你需要的
export const YourPage2 = () => {
  return (
    <div>
      <TransCasDict joinFather separator="" type="bizType" code="14-01" />
      <h1>
        测试字典翻译,结果应该是<code>服务产品信息审核业</code>!
      </h1>
    </div>
  );
};
