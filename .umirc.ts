import { IConfig } from 'umi-types';
import routes from './config/route';
import proxy from './config/proxy';
import theme from './config/theme';
import { projectName, baseUrl, publicPath } from './config/projectConfig';
// 生成版本信息
import './config/commit';

const path = require('path');

// ref: https://umijs.org/config/
const config: IConfig = {
  routes,
  sass: {},
  proxy,
  theme,
  treeShaking: true,
  hash: true,
  base: baseUrl,
  publicPath,
  define: {
    'process.env.UA': process.env.UA,
    'process.env.AES': process.env.AES,
  },
  autoprefixer: {
    browsers: [
      '>1%',
      'last 5 versions',
      'Firefox ESR',
      'not ie < 9', // React doesn't support IE8 anyway
    ],
    flexbox: true,
  },
  alias: {
    '#': path.resolve(__dirname, 'config/'),
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: false,
        dynamicImport: {
          webpackChunkName: true,
          loadingComponent: './components/Loading',
        },
        title: projectName,
        dll: false,

        routes: {
          exclude: [
            /stores\//,
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
            /utils\//,
            /config\.(t|j)sx?$/,
          ],
        },
      },
    ],
  ],
};

export default config;
