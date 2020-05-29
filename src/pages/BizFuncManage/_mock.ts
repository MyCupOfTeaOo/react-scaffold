/* eslint-disable no-template-curly-in-string */

import moment from 'moment';
import mockjs from 'mockjs';
import arrayMove from 'array-move';
import lodash from 'lodash';
import { apiPrefix } from '../../../config/projectConfig';

const entities = [
  {
    _id: '990000199709226497',
    pages: [
      {
        id: '350000197301236845',
        title: '列表页',
        key: 'list',
        desc: '123',
        source: {
          queryItem: [
            {
              fieldCode: 'name',
            },
            {
              fieldCode: 'date',
              type: 'datepicker',
              placeholder: '请选择日期',
            },
          ],
          queryButton: [
            {
              name: '查询',
              func: 'submit',
              type: 'primary',
              size: 'middle',
            },
            {
              name: '重置',
              func: 'reset',
              type: 'default',
              size: 'middle',
            },
          ],
          grid: {
            columnDefs: [
              {
                field: '$virtualField',
                pinned: 'left',
                width: 194,
              },
              {
                field: 't1',
                pinned: null,
                width: 200,
              },
              {
                field: 'date',
                pinned: null,
                width: 200,
              },
              {
                field: 'name',
                pinned: null,
                width: 200,
              },
            ],
            base: {
              fetchUrl: 'test',
              historyMemory: true,
            },
            pageSize: 10,
            sorters: [],
            operationConfig: [
              {
                name: '编辑',
                func: 'router',
                type: 'primary',
                funcProps: {
                  url:
                    '/990000199709226497/340000202002264135/preview?name=${rowData.name}',
                  open: false,
                },
              },
              {
                name: '删除',
                func: 'interface',
                type: 'danger',
                funcProps: {
                  url: '/test/${rowData.name}',
                  data: '',
                  alert: '确定要删除吗',
                  method: 'delete',
                  reload: true,
                },
              },
              {
                name: '测试post',
                func: 'interface',
                type: 'primary',
                funcProps: {
                  url: '/test',
                  method: 'post',
                  data: '{\n"page":1,\n"len":5,\n"name":${rowData.name}\n}',
                  reload: true,
                  alert: '确定要请求吗',
                },
              },
            ],
          },
        },
      },
      {
        id: '340000202002264135',
        title: '表单',
        key: 'baseForm',
        source: {
          title: '编辑个人信息',
          formItem: [
            {
              fieldCode: 'name',
            },
            {
              fieldCode: 'date',
              type: 'datepicker',
              placeholder: '请选择日期',
            },
          ],
          formButton: [
            {
              name: '提交',
              func: 'interface',
              type: 'primary',
              size: 'middle',
              funcProps: {
                url: '/test/${loadData.name}',
                method: 'post',
                data: '{\n${...loadData},\n${...formData}\n}',
                reload: true,
                goback: true,
              },
              isSubmit: true,
              checked: true,
            },
            {
              name: '删除',
              func: 'interface',
              type: 'danger',
              size: 'middle',
              funcProps: {
                reload: false,
                goback: true,
                method: 'delete',
                url: '/test/${query.name}',
                alert: '您确定要删除该数据吗',
                replace: '',
              },
              assert: 'this.expect(this.query.name).not.to.be(undefined)',
            },
            {
              name: '返回',
              func: 'goback',
              type: 'default',
              size: 'middle',
            },
          ],
          layout: 'horizontal',
          loadUrl: '/test/${query.name}',
        },
      },
    ],
    fields: [
      {
        code: 'name',
        name: '名称',
        type: 'string',
        desc: '',
        primary: true,
      },
      {
        code: 'date',
        name: '日期',
        type: 'date',
      },
      {
        code: 't1',
        name: 't1',
        type: 'string',
      },
      {
        code: 't2',
        name: 't2',
        type: 'string',
      },
      {
        code: 't3',
        name: 't3',
        type: 'string',
      },
      {
        code: 't4',
        name: 't4',
        type: 'string',
      },
    ],
    name: '权限',
    desc: '123',
  },
];

const projects: {
  [key: string]: any;
} = [...Array(21)].map(() => ({
  _id: mockjs.Random.id(),
  name: mockjs.Random.cname(),
  description: mockjs.Random.cparagraph(),
}));

// 预览测试
const list: {
  [key: string]: any;
} = [...Array(21)].map(() => ({
  date: mockjs.Random.date(),
  name: mockjs.Random.cname(),
}));

const returnUtil = (data?: any) => ({
  data,
  code: 200,
  msg: '请求成功啦',
  timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
});

const delay = 500;

export default {
  [`POST /${apiPrefix}/proj/projects/search`]: (req: any, res: any) => {
    const { page, len, sortColumns = [], queryData = {} } = req.body;
    const sortProjectList = lodash.orderBy(
      projects.filter((item: any) => {
        return Object.keys(queryData).every(
          key => item[key as string] === queryData[key],
        );
      }),
      sortColumns.map((sorter: any) => sorter.columnProp),
      sortColumns.map((sorter: any) => sorter.columnOrder),
    );
    const totalitem = sortProjectList.length;
    const final = sortProjectList.slice((page - 1) * len, page * len);
    setTimeout(
      () =>
        res.send(
          returnUtil({
            list: final,
            totalitem,
          }),
        ),
      delay,
    );
  },
  [`GET /${apiPrefix}/page/projects/:projectId/entities`]: (
    req: any,
    res: any,
  ) => {
    setTimeout(() => res.send(returnUtil(entities)), delay);
  },
  [`POST /${apiPrefix}/page/projects/:projectId/entities`]: (
    req: any,
    res: any,
  ) => {
    const entity = {
      id: mockjs.Random.id(),
      pages: [],
      fields: [],
      ...req.body,
    };
    entities.push(entity);
    setTimeout(
      () =>
        res.send(
          returnUtil({
            id: entity._id,
          }),
        ),
      delay,
    );
  },
  [`GET /${apiPrefix}/page/projects/:projectId/entities/:id`]: (
    req: any,
    res: any,
  ) => {
    setTimeout(
      () =>
        res.send(
          returnUtil(entities.find(entity => entity._id === req.params.id)),
        ),
      delay,
    );
  },
  [`DELETE /${apiPrefix}/page/projects/:projectId/entities/:id`]: (
    req: any,
    res: any,
  ) => {
    const index = entities.findIndex(entity => entity._id === req.params.id);
    if (index > -1) {
      entities.splice(index, 1);
    }
    setTimeout(() => res.send(returnUtil()), delay);
  },
  [`PATCH /${apiPrefix}/page/projects/:projectId/entities/:id`]: (
    req: any,
    res: any,
  ) => {
    const target = entities.find(entity => entity._id === req.params.id);
    if (target) {
      Object.assign(target, req.body);
    }
    setTimeout(() => res.send(returnUtil()), delay);
  },
  [`POST /${apiPrefix}/page/projects/:projectId/entities/:id/fields`]: (
    req: any,
    res: any,
  ) => {
    const target = entities.find(entity => entity._id === req.params.id);

    const prevField = target?.fields.find(
      field => field.code === req.body.code,
    );
    if (prevField) {
      Object.assign(prevField, req.body);
    } else {
      target?.fields.push(req.body);
    }

    setTimeout(() => res.send(returnUtil()), delay);
  },
  [`PUT /${apiPrefix}/page/projects/:projectId/entities/:id/fields/:code`]: (
    req: any,
    res: any,
  ) => {
    const target = entities.find(entity => entity._id === req.params.id);

    const prevField = target?.fields.find(
      field => field.code === req.params.code,
    );
    if (prevField) {
      Object.assign(prevField, req.body);
    } else {
      target?.fields.push(req.body);
    }

    setTimeout(() => res.send(returnUtil()), delay);
  },
  [`DELETE /${apiPrefix}/page/projects/:projectId/entity/:id/fields/:code`]: (
    req: any,
    res: any,
  ) => {
    const target = entities.find(entity => entity._id === req.params.id);
    if (target) {
      const index = target.fields.findIndex(
        field => field.code === req.params.code,
      );
      if (index > -1) {
        target.fields.splice(index, 1);
      }
    }
    setTimeout(() => res.send(returnUtil()), delay);
  },
  [`PUT /${apiPrefix}/page/projects/:projectId/entities/:id/fields/:code/primary`]: (
    req: any,
    res: any,
  ) => {
    const target = entities.find(entity => entity._id === req.params.id);
    if (target) {
      const curField = target.fields.find(
        field => field.code === req.params.code,
      );
      if (curField) {
        const prevField = target.fields.find(field => field.primary);
        if (prevField) prevField.primary = false;
        curField.primary = true;
      }
    }
    setTimeout(() => res.send(returnUtil()), delay);
  },
  [`POST /${apiPrefix}/page/projects/:projectId/entities/:id/pages`]: (
    req: any,
    res: any,
  ) => {
    const page = {
      id: mockjs.Random.id(),
      ...req.body,
    };
    const target = entities.find(entity => entity._id === req.params.id);

    target?.pages.push(page);

    setTimeout(() => res.send(returnUtil(page)), delay);
  },
  [`GET /${apiPrefix}/page/projects/:projectId/entities/:id/pages/:pageid`]: (
    req: any,
    res: any,
  ) => {
    const target = entities.find(entity => entity._id === req.params.id);

    setTimeout(
      () =>
        res.send(
          returnUtil(target?.pages.find(page => page.id === req.params.pageid)),
        ),
      delay,
    );
  },
  [`PUT /${apiPrefix}/page/projects/:projectId/entities/:id/pages/:pageId`]: (
    req: any,
    res: any,
  ) => {
    const target = entities.find(entity => entity._id === req.params.id);
    const prevPage = target?.pages.find(page => page.id === req.params.pageId);
    Object.assign(prevPage, req.body);
    setTimeout(() => res.send(returnUtil(prevPage)), delay);
  },
  [`DELETE /${apiPrefix}/page/projects/:projectId/entities/:id/pages/:pageId`]: (
    req: any,
    res: any,
  ) => {
    const target = entities.find(entity => entity._id === req.params.id);
    const pageIndex = target?.pages.findIndex(
      page => page.id === req.params.pageId,
    );
    if (pageIndex !== undefined && pageIndex > -1) {
      target?.pages.splice(pageIndex, 1);
    }
    setTimeout(() => res.send(returnUtil()), delay);
  },
  [`POST /${apiPrefix}/page/projects/:projectId/entities/:id/pages/move`]: (
    req: any,
    res: any,
  ) => {
    const target = entities.find(entity => entity._id === req.params.id);
    if (target) {
      arrayMove.mutate(target.pages, req.body.from, req.body.to);
    }
    setTimeout(() => res.send(returnUtil()), delay);
  },

  // 预览测试接口
  [`POST /${apiPrefix}/test`]: (req: any, res: any) => {
    const { page, len, sortColumns = [], queryData = {} } = req.body;
    const sortList = lodash.orderBy(
      list.filter((item: any) => {
        return Object.keys(queryData).every(
          key => item[key as string] === queryData[key],
        );
      }),
      sortColumns.map((sorter: any) => sorter.columnProp),
      sortColumns.map((sorter: any) => sorter.columnOrder),
    );
    const totalitem = sortList.length;
    const final = sortList.slice((page - 1) * len, page * len);
    setTimeout(
      () =>
        res.send(
          returnUtil({
            list: final,
            totalitem,
          }),
        ),
      delay,
    );
  },
  [`GET /${apiPrefix}/test/:name`]: (req: any, res: any) => {
    const { name } = req.params;
    let target: any;
    if (name) {
      target = list.find((item: any) => item.name === name);
    }
    setTimeout(() => res.send(returnUtil(target)), delay);
  },
  [`POST /${apiPrefix}/test/:name`]: (req: any, res: any) => {
    const { name } = req.params;
    if (name) {
      const target = list.find((item: any) => item.name === name);
      Object.assign(target || {}, req.body);
    } else {
      list.push(req.body);
    }
    setTimeout(() => res.send(returnUtil()), delay);
  },
  [`DELETE /${apiPrefix}/test/:name`]: (req: any, res: any) => {
    const { name } = req.params;
    if (name) {
      const index = list.findIndex((item: any) => item.name === name);
      if (index > -1) {
        list.splice(index, 1);
      }
    }
    setTimeout(() => res.send(returnUtil()), delay);
  },
};
