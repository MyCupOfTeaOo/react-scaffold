# react手脚架

<!-- TOC -->

- [1. 概述](#1-概述)
- [2. 安装与运行](#2-安装与运行)
- [3. 项目结构](#3-项目结构)
  - [3.1. 目录结构](#31-目录结构)
- [4. 开发环境配置](#4-开发环境配置)
- [5. 组件用例](#5-组件用例)
- [6. 备注](#6-备注)

<!-- /TOC -->

# 1. 概述

基于 `mobx` + `react` + `react router` + `umi` +`TypeScript` 的 react 前端
组件库选用 `antd`,`teaness`

# 2. 安装与运行

> 安装 `npm i`
> 运行 `npm run start`

# 3. 项目结构

## 3.1. 目录结构

```
├─config 项目配置目录
│  ├─pages.ts 页面与菜单id绑定
│  ├─projectConfig.ts 项目配置文件,如前缀,项目名,打包base路径等等
│  ├─proxy.ts 代理 dev环境下代理接口路径配置
│  └─route.ts 路由配置文件(除非本地路由,不然不需要动这个问题,直接去`pages.ts`绑定菜单id即可)
├─public 公共资源文件(目前只有网站ico图标)
├─src
│  ├─assets 静态的资产(图片,svg,json等等)
│  ├─block 业务组件 (与业务强关联的组件,甚至可以是一个页面)
│  ├─components 通用组件 (与业务无关的通用型组件)
│  ├─layouts 页面框架,不需要动
│  ├─pages 路由页面  改文件夹下也可以定义 Component 文件夹用来区别非页面的业务强关联非多个页面复用的组件
│  ├─service 接口(所有接口的聚合)
│  ├─stores 状态库(mobx 状态库,如果是全局状态需要在Global.ts注册)
│  ├─utils
│  │  ├─authority.ts 权限封装
│  │  ├─cache.ts 缓存封装
│  │  ├─request.ts request请求封装
│  │  ├─utils.ts 工具集
│  ├─app.ts 参考umi文档,不需要动
│  ├─constant.ts 常量
│  ├─global.scss 全局css
│  ├─typings.scss 比较重要的type定义
├─...

```

pages 下的 `.umi`,`.pages.ts`是自动生成的不允许动

# 4. 开发环境配置

vscode settings 可以配上

```javaScript
{
    "prettier.eslintIntegration": true,
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        "typescript",
        "typescriptreact",
        { "language": "javascript", "autoFix": true },
        { "language": "javascriptreact", "autoFix": true },
        { "language": "typescript", "autoFix": true },
        { "language": "typescriptreact", "autoFix": true }
    ],
}
```

# 5. 组件用例

组件库地址 http://192.168.117.120/teaness

# 6. 备注
