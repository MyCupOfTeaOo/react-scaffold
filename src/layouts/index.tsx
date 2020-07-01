import React, { useEffect } from 'react';
import { ConfigProvider, Spin, Modal } from 'antd';
import { Provider, observer } from 'mobx-react';
import DataGridRegister from 'teaness/es/DataGrid/DataGridRegister';
import zhCN from 'antd/es/locale/zh_CN';
import defaultLocale from 'antd/es/locale/default';
import router from 'umi/router';
import { Base64 } from 'js-base64';
import { PictureView, BaseGrid, Upload } from 'teaness';
import Axios from 'axios';
import Boundary from '@/components/Boundary';
import { RequestData, ResponseData } from 'teaness/es/DataGrid/typings';
import { CancellablePromise } from 'teaness/es/typings';
import stores from '@/stores';
import { RouteProps } from '@/typings';
import request, { ReqResponse } from '@/utils/request';
import { getFileInfo, uploadFile } from '@/service/file';
import { setToken, getToken } from '@/utils/authority';
import styles from './index.scss';
import { apiPrefix } from '#/projectConfig';

if (zhCN.Modal) {
  zhCN.Modal.justOkText = '确定';
}

Modal.defaultProps = {
  ...Modal.defaultProps,
  centered: true,
} as any;
// fix show english
Object.assign(defaultLocale, zhCN);
function dataGridRequest<T>(
  url: string,
  payload: RequestData<T>,
  options?: { headers: any },
) {
  const sortColumns = payload.sorters?.map(sorter => ({
    columnOrder: sorter.sort,
    columnProp: sorter.colId,
  }));

  const { token: cancelToken, cancel } = Axios.CancelToken.source();
  const promise = request.post(
    url,
    {
      queryData: payload.queryData || {},
      sortColumns,
      len: payload.pageSize,
      page: payload.page,
    },
    {
      cancelToken,
      headers: options?.headers,
    },
  ) as Promise<ReqResponse>;
  const t = promise.then(res => {
    if (res.isSuccess) {
      return {
        list: res.data.list,
        total: res.data.totalitem,
      };
    }
    if (res.isCancel) {
      return {
        isCancel: true,
        list: [],
        total: 0,
      };
    }
    return Promise.reject(new Error(res.msg));
  }) as CancellablePromise<ResponseData<T>>;
  t.cancel = cancel;
  return t;
}

BaseGrid.defaultProps = {
  ...BaseGrid.defaultProps,
  headerHeight: 32,
  rowHeight: 32,
  noRowsOverlayComponentFramework: () => <span>暂无数据</span>,
};
DataGridRegister.request = dataGridRequest;
DataGridRegister.router = router;
DataGridRegister.defaultPageSize = 20;
Upload.defaultProps = {
  ...Upload.defaultProps,
  onUpload: uploadFile,
  onPreview: file => {
    if (/image\/.*/.test(file.type)) {
      if (file.originFileObj) {
        const reader = new FileReader();
        reader.onload = e => {
          PictureView({
            src: e.target?.result as string,
          });
        };
        reader.readAsDataURL(file.originFileObj);
      } else {
        PictureView({
          src: file.thumbUrl || file.url,
        });
      }
    } else if (file.originFileObj) {
      Modal.error({
        content: '暂未上传,上传后可查看',
      });
    } else if (file.type === 'application/pdf') {
      window.open(
        `/${apiPrefix}/file/previewFileByUri?uri=${file.uid}`,
        '_blank',
      );
    } else {
      window.open(file.thumbUrl || file.url);
    }
  },
  getFile: getFileInfo,
  onDownload: file => {
    window.open(file.thumbUrl || file.url);
  },
};

const Layout: React.FC<RouteProps<
  {},
  undefined,
  {
    token?: string;
    sysId?: string;
  }
>> = props => {
  useEffect(() => {
    const { sysId } = props.location.query;
    const { token } = props.location.query;
    if (token) setToken(token);
    const newToken = getToken();
    if (sysId) {
      stores.global.setSysId(sysId);
    }
    if (newToken) {
      const code = newToken?.split('.')?.[1];
      if (code) {
        const sys = JSON.parse(Base64.decode(code));
        stores.global.setSysId(sys.sysId);
        stores.user.loadUser();
      }
    }
    if (sysId) {
      router.replace({
        pathname: props.location.pathname,
        query: stores.global.isMain
          ? undefined
          : {
              ...props.location.query,
              sysId: stores.global.sysId,
            },
      });
    }
  }, []);

  if (!stores.user.user && getToken()) {
    // 主动退出但是在其他页面登录了
    if (stores.user.loaded) {
      stores.user.loadUser();
    }
    return (
      <Spin tip="登录中...">
        <div className={styles.normal} />
      </Spin>
    );
  }

  return (
    <Boundary>
      <ConfigProvider locale={zhCN}>
        <Provider {...stores}>
          <div className={styles.normal}>{props.children}</div>
        </Provider>
      </ConfigProvider>
    </Boundary>
  );
};

export default observer(Layout);
