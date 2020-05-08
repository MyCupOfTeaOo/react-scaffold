export const baseUrl: string =
  process.env.NODE_ENV === 'development' ? '/' : '/'; // url根路径
export const publicPath: string = '/'; // 打包文件根路径
export const projectName: string = '手脚架'; // 项目名
export const prefix: string | undefined = 'tic'; // 项目前缀 与 页面缓存相关
export const sysId: string = 'tic'; // 子系统id 与 菜单加载相关
export const apiPrefix: string =
  process.env.NODE_ENV === 'development' ? 'api' : 'api'; // request 请求前缀
export const copyright: string = `${new Date().getFullYear()} 南京全高信息科技有限公司出品`;
export const UA = process.env.UA || 'UA-154956873-1';
export const aes = process.env.AES || 'testt';
