import mockjs from 'mockjs';
import moment from 'moment';
import { apiPrefix } from '../../../../config/projectConfig';

const returnUtil = (data?: any) => ({
  data,
  code: 200,
  msg: '请求成功啦',
  timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
});

const delay = 200;

export default {
  [`GET /${apiPrefix}/test`]: (req, res) => {
    setTimeout(
      () =>
        res.send(
          returnUtil({
            name: '测试接口',
            description: mockjs.Random.cparagraph(),
          }),
        ),
      delay,
    );
  },
};
