import mockjs from 'mockjs';
import moment from 'moment';
import { apiPrefix } from '../config/projectConfig';

function genDicts(dictType: string, level: number = 1) {
  return [...Array(3)].map(() => ({
    label: mockjs.Random.cname(),
    value: mockjs.Random.id(),
    isLeaf: level <= 1,
    description: mockjs.Random.cparagraph(),
    children: level > 1 ? genDicts(dictType, level - 1) : undefined,
  }));
}

const dicts = genDicts('label', 3);

function getTargetDicts(code?: string) {
  if (!code) {
    return {
      children: dicts,
    };
  }
  const codes = code.split('-');
  function search(codeList: string[], dictList: any[]) {
    const target = dictList.find(dict => {
      return dict.value === codeList[0];
    });
    if (!target) {
      return undefined;
    }

    if (codeList.length > 1) {
      return search(codeList.slice(1), target.children || []);
    }
    return target;
  }
  return search(codes, dicts);
}

const returnUtil = (data?: any) => ({
  data,
  code: 200,
  msg: '请求成功啦',
  timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
});

const delay = 500;

export default {
  [`GET /${apiPrefix}/:server/dicts/:dictType`]: (req: any, res: any) => {
    const { code, queryAll } = req.query;
    const target = getTargetDicts(code);
    const filterTarget = target
      ? {
          ...target,
          children: queryAll ? target.children : undefined,
        }
      : undefined;
    setTimeout(() => res.send(returnUtil(filterTarget)), delay);
  },
  [`GET /${apiPrefix}/:server/dicts/:dictType/children`]: (
    req: any,
    res: any,
  ) => {
    const { code, queryAll } = req.query;
    const target = getTargetDicts(code);
    const filterTarget = target.children.map(item => ({
      ...item,
      children: queryAll ? item.children : undefined,
    }));
    setTimeout(() => res.send(returnUtil(filterTarget)), delay);
  },
};
