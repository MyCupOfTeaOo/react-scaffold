import Axios, { CancelToken } from 'axios';
import { UploadFile } from 'teaness/es/Form/Components/Upload/typings';
import request from '@/utils/request';
import { apiPrefix } from '#/projectConfig';

export function getFileInfoByUri(uri: string, cancelToken?: CancelToken) {
  return request.post(
    `/file/getFileInfoByUri`,
    {},
    {
      params: { uri },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      cancelToken,
    },
  );
}

export function uploadFile(
  file: File | UploadFile,
  onUploadProgress?: (percent: number, progressEvent?: any) => void,
) {
  const source = Axios.CancelToken.source();
  const formData = new FormData();
  formData.append('file', ((file as UploadFile).originFileObj || file) as File);
  const r = request
    .post('/file/uploadFile', formData, {
      cancelToken: source.token,
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: onUploadProgress
        ? (progressEvent: any) => {
            onUploadProgress(
              Math.floor((progressEvent.loaded * 100) / progressEvent.total),
              progressEvent,
            );
          }
        : undefined,
    })
    .then(resp => {
      if (resp.isSuccess) {
        return {
          uid: resp.data.uri,
          name: resp.data.originalFileName,
          url: `/${apiPrefix}/file/downloadFileByUri?uri=${resp.data.uri}`,
          size: resp.data.fileSize,
          type: resp.data.fileType,
        };
      } else {
        return Promise.reject(resp);
      }
    }) as Promise<{
    uid: string;
    name: string;
    url: string;
    size: number;
    type: string;
  }> & {
    cancel: () => void;
  };
  r.cancel = source.cancel;
  return r;
}

export const getFileInfo = (uri: string) => {
  const { token, cancel } = Axios.CancelToken.source();
  const r = getFileInfoByUri(uri, token).then(resp => {
    if (resp.isSuccess && resp.data) {
      return {
        name: resp.data.originalFileName,
        url: `/${apiPrefix}/file/downloadFileByUri?uri=${resp.data.uri}`,
        size: resp.data.fileSize,
        type: resp.data.fileType,
      };
    } else {
      return Promise.reject(resp);
    }
  }) as Promise<{
    name: string;
    url: string;
    size: number;
    type: string;
  }> & {
    cancel: () => void;
  };
  r.cancel = cancel;
  return r;
};
