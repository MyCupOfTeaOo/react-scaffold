---
group:
  path: /
---

# cache(缓存)

用来处理前端缓存,操作同域的 `localStroage`,`sessionStorage`

## 会话

重新打开网页即不存在

```ts
import cache from '@/utils/cache';
// 存
cache.set('你的key', '值,可以是任何类型');
cache.set('test', { test: 1213 });
// 取
const test = cache.get<{ test: number }>('test');
// 删除
cache.delete('test');
```

## 本地存储

除非用户主动清除缓存,则会永久存储

```ts
import cache from '@/utils/cache';
// 存
cache.setLocalCache('你的key', '值,可以是任何类型');
cache.setLocalCache('test', { test: 1213 });
// 取
const test = cache.getLocalCache<{ test: number }>('test');
// 删除
cache.deleteLocalCache('test');
```
