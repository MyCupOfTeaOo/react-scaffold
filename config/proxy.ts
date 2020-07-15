import { apiPrefix } from './projectConfig';
import mock from './mock';

const proxy = {
  [`/${apiPrefix}`]: {
    target: 'http://dev.jsbi.web',
    changeOrigin: true,
  },

  ...(process.env.MOCK === 'true' ? mock : {}),
};
export default proxy;
