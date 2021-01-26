---
group:
  path: /
---

# crypto(数据加密)

用来处理数据的加密与解密

## 基本用例

```ts
import { encode, decode } from '@/utils/crypto';
// 定义一个数据源
const source = {
  moblie: 18666666666,
  idCard: '32128888888888123888',
  members: [
    {
      name: 'hello',
      moblie: 18666666666,
      idCard: '32128888888888123888',
    },
  ],
};
// 定义一个需要加密的字段描述
const keys = [
  'moblie',
  'idCard',
  'members[0].moblie',
  'members[0].idCard',
  'members[1].moblie',
  'members[1].idCard',
];
// 加密后的对象,只会对keys中指定的key加密
const encodeObj = encode(source, keys);
// 解密,只会对keys中指定的key解密
const decodeObj = decode(encodeObj, keys);
// 对非对象加密解密
const encodeStr = encode('代加密字符串');
const decodeStr = decode(encodeStr);
```
