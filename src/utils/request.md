---
group:
  path: /
---

# request(请求)

用来处理前端请求

## 基本用例

<code src="./example/request/Base.tsx" />

## 其他 api

### 下载

使用其中的 download 方法

```ts
import { download } from '@/utils/request';
```

文件名可以不填,不填则自动使用后端返回的文件名

### 修改默认的 403 行为

对于整个项目可能要修改默认的 403 处理行为
默认行为是清除 token,并重定向到登录

```ts
clearToken();
window.location.href = `/sign/signIn`;
```

如果需要修改可以这样处理

> 注意 ⚠️ 这会影响全局行为

```ts
import { extend } from '@/utils/request';
extend({
  noPermission() {
    // ... 你的处理代码
  },
});
```
