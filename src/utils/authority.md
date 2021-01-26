---
group:
  path: /
---

# authority(权限)

用来处理前端权限,其实是在`cache`工具上面套了一层壳

## 基本用例

```ts
import { setToken, getToken, clearToken } from '@/utils/aithority';

// 设置token
setToken('xxxx');
// 获取token
getToken();
// 清除token
clearToken();
```
