import request, { CancellablePromise, ReqResponse } from '@/utils/request';
import Axios from 'axios';
import { Field, Page, Entity } from 'micro-page-core/es/typings';
import { ServiceThis } from 'micro-page-core';

type GetResponseDataType<
  T extends CancellablePromise<ReqResponse<any>>
> = T extends CancellablePromise<ReqResponse<infer R>> ? R : any;

function responseProcess<R extends CancellablePromise<ReqResponse<any>>>(
  promise: R,
) {
  const req = promise.then(res => {
    if (res.isSuccess) {
      return res.data;
    } else if (res.isCancel) {
      return Promise.reject(new Error('操作取消'));
    } else {
      return Promise.reject(new Error(res.msg));
    }
  }) as CancellablePromise<GetResponseDataType<R>>;
  req.cancel = promise.cancel;
  return req;
}

export function newEntity(
  this: ServiceThis,
  data: { name: string; desc?: string },
) {
  const source = Axios.CancelToken.source();
  const req = request.post(`/page/projects/${this.projectId}/entities`, data, {
    cancelToken: source.token,
  }) as CancellablePromise<
    ReqResponse<{
      id: string;
    }>
  >;
  req.then(res => {
    if ((res.data as any)?._id) {
      // 数据兼容
      (res.data as any).id = (res.data as any)._id;
    }
    return res;
  });
  req.cancel = source.cancel;
  return responseProcess(req);
}

export function deleteEntity(this: ServiceThis, id: string) {
  const source = Axios.CancelToken.source();
  const req = request.delete(
    `/page/projects/${this.projectId}/entities/${id}`,
    {
      cancelToken: source.token,
    },
  ) as CancellablePromise<ReqResponse<void>>;
  req.cancel = source.cancel;
  return responseProcess(req);
}

export function getEntity(this: ServiceThis, id: string) {
  const source = Axios.CancelToken.source();
  const req = request.get(`/page/projects/${this.projectId}/entities/${id}`, {
    cancelToken: source.token,
  }) as CancellablePromise<
    ReqResponse<
      Entity & {
        pages: Omit<Page, 'source'>[];
      }
    >
  >;
  req.then(res => {
    if ((res.data as any)?._id) {
      // 数据兼容
      (res.data as any).id = (res.data as any)._id;
    }
    return res;
  });
  req.cancel = source.cancel;
  return responseProcess(req);
}

export function getEntities(this: ServiceThis) {
  const source = Axios.CancelToken.source();
  const req = request.get(`/page/projects/${this.projectId}/entities`, {
    cancelToken: source.token,
  }) as CancellablePromise<ReqResponse<Pick<Entity, 'id' | 'name' | 'desc'>[]>>;
  req.cancel = source.cancel;
  req.then(res => {
    res.data?.forEach(entity => {
      // eslint-disable-next-line
      entity.id = (entity as any)._id;
    });
    return res;
  });
  return responseProcess(req);
}

export function patchEntity(
  this: ServiceThis,
  id: string,
  data: {
    name: string;
    desc?: string;
  },
) {
  const source = Axios.CancelToken.source();
  const req = request.patch(
    `/page/projects/${this.projectId}/entities/${id}`,
    data,
    {
      cancelToken: source.token,
    },
  ) as CancellablePromise<ReqResponse<void>>;
  req.cancel = source.cancel;
  return responseProcess(req);
}

export function addField(this: ServiceThis, id: string, data: Field) {
  const source = Axios.CancelToken.source();
  const req = request.post(
    `/page/projects/${this.projectId}/entities/${id}/fields`,
    data,
    {
      cancelToken: source.token,
    },
  ) as CancellablePromise<ReqResponse<void>>;
  req.cancel = source.cancel;
  return responseProcess(req);
}

export function updateField(
  this: ServiceThis,
  id: string,
  code: string,
  data: Field,
) {
  const source = Axios.CancelToken.source();
  const req = request.put(
    `/page/projects/${this.projectId}/entities/${id}/fields/${code}`,
    data,
    {
      cancelToken: source.token,
    },
  ) as CancellablePromise<ReqResponse<void>>;
  req.cancel = source.cancel;
  return responseProcess(req);
}

export function deleteField(this: ServiceThis, id: string, code: string) {
  const source = Axios.CancelToken.source();
  const req = request.delete(
    `/page/projects/${this.projectId}/entities/${id}/fields/${code}`,
    {
      cancelToken: source.token,
    },
  ) as CancellablePromise<ReqResponse<void>>;
  req.cancel = source.cancel;
  return responseProcess(req);
}

export function setPrimaryKey(this: ServiceThis, id: string, code: string) {
  const source = Axios.CancelToken.source();
  const req = request.put(
    `/page/projects/${this.projectId}/entities/${id}/fields/${code}/primary`,
    {},
    {
      cancelToken: source.token,
    },
  ) as CancellablePromise<ReqResponse<void>>;
  req.cancel = source.cancel;
  return responseProcess(req);
}

export function addPage(
  this: ServiceThis,
  entityId: string,
  data: Omit<Page, 'id'>,
) {
  const source = Axios.CancelToken.source();
  const req = request.post(
    `/page/projects/${this.projectId}/entities/${entityId}/pages`,
    data,
    {
      cancelToken: source.token,
    },
  ) as CancellablePromise<ReqResponse<Page>>;
  req.cancel = source.cancel;
  return responseProcess(req);
}

export function getPage(this: ServiceThis, entityId: string, pageId: string) {
  const source = Axios.CancelToken.source();
  const req = request.get(
    `/page/projects/${this.projectId}/entities/${entityId}/pages/${pageId}`,
    {
      cancelToken: source.token,
    },
  ) as CancellablePromise<ReqResponse<Page>>;
  req.cancel = source.cancel;
  return responseProcess(req);
}

export function updatePage(this: ServiceThis, entityId: string, data: Page) {
  const source = Axios.CancelToken.source();
  const req = request.put(
    `/page/projects/${this.projectId}/entities/${entityId}/pages/${data.id}`,
    data,
    {
      cancelToken: source.token,
    },
  ) as CancellablePromise<ReqResponse<void>>;
  req.cancel = source.cancel;
  return responseProcess(req);
}

export function deletePage(
  this: ServiceThis,
  entityId: string,
  pageId: string,
) {
  const source = Axios.CancelToken.source();
  const req = request.delete(
    `/page/projects/${this.projectId}/entities/${entityId}/pages/${pageId}`,
    {
      cancelToken: source.token,
    },
  ) as CancellablePromise<ReqResponse<void>>;
  req.cancel = source.cancel;
  return responseProcess(req);
}

export function movePage(
  this: ServiceThis,
  entityId: string,
  from: number,
  to: number,
) {
  const source = Axios.CancelToken.source();
  const req = request.post(
    `/page/projects/${this.projectId}/entities/${entityId}/pages/move`,
    {
      from,
      to,
    },
    {
      cancelToken: source.token,
    },
  ) as CancellablePromise<ReqResponse<void>>;
  req.cancel = source.cancel;
  return responseProcess(req);
}

export function copyPage(
  this: ServiceThis,
  entityId: string,
  fromPageId: string,
  data: Partial<Page>,
) {
  const source = Axios.CancelToken.source();
  const req = request.post(
    `/page/projects/${this.projectId}/entities/${entityId}/pages/copy/${fromPageId}`,
    data,
    {
      cancelToken: source.token,
    },
  ) as CancellablePromise<ReqResponse<Page>>;
  req.cancel = source.cancel;
  return responseProcess(req);
}
