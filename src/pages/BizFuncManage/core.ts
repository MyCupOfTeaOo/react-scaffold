import { MicroPageCore, List, BaseForm } from 'micro-page';
import { CancellablePromise } from 'teaness/es/typings';
import { coreRequest } from '@/utils/request';
import listCover from './assets/list.png';
import {
  newEntity,
  getEntity,
  deleteEntity,
  patchEntity,
  getEntities,
  addField,
  updateField,
  deleteField,
  setPrimaryKey,
  addPage,
  getPage,
  updatePage,
  deletePage,
  movePage,
  copyPage,
} from './service';

const core = new MicroPageCore({
  templates: [
    {
      key: 'list',
      name: '列表页',
      cover: listCover,
      plugin: new List({
        completeRequest: {
          url() {
            const req = Promise.resolve([
              { value: 'test' },
            ]) as CancellablePromise<any>;
            req.cancel = () => {};
            return req;
          },
        },
        completeFilter: {
          url(input, option) {
            return (option?.value as string).indexOf(input) > -1;
          },
        },
      }),
    },
    {
      key: 'baseForm',
      name: '基本表单',
      plugin: new BaseForm({}),
    },
  ],
  service: {
    newEntity,
    getEntity,
    deleteEntity,
    getEntities,
    patchEntity,
    addField,
    updateField,
    deleteField,
    setPrimaryKey,
    addPage,
    getPage,
    updatePage,
    deletePage,
    movePage,
    copyPage,
  },
  request: coreRequest,
});

export default core;
