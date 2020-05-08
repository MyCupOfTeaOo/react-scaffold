import { apiPrefix } from './projectConfig';
import mock from './mock';

const proxy = {
  [`/${apiPrefix}`]: {
    target: 'http://192.168.117.102:84',
    changeOrigin: true,
  },

  ...(process.env.MOCK === 'true' ? mock : {}),
};
export default proxy;
