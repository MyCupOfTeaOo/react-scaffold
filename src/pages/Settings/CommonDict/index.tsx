import React, { useMemo, useState, useRef } from 'react';
import { Button, message, Badge, Input, Modal } from 'antd';
import {
  Select,
  useForm,
  DataGrid,
  useStore,
  Col,
  useDataGrid,
  horizontal,
} from 'teaness';
import { FormConfigs } from 'teaness/es/Form/typings';
import { inject } from 'mobx-react';
import { ColumnDefs } from 'teaness/es/DataGrid/typings';
import { RouteProps } from '@/typings';
import { enableState, enableOptions } from '@/constant';
import { MenuId2Url } from '@/stores/Global';
import { switchCommonDict } from '@/service/config';

import { loadDictType } from '@/combination';
import Info, { InfoRef } from './components/InfoModal';

export interface CommonDictProps extends RouteProps {
  menuId2Url: MenuId2Url;
}

type FormType = Partial<{
  dictType: string;
  dictCode: string;
  dictValue: string;
  dictState: number;
}>;

const CommonDict: React.FC<CommonDictProps> = props => {
  const { gridProps, gridRef, setQueryData, queryDataRef } = useDataGrid({
    location: props.location,
    historyId: 'grid',
  });
  const [visible, setVisible] = useState(false);
  const [info, setInfo] = useState<any>({});
  const formConfigs = useMemo<FormConfigs<FormType>>(
    () => ({
      dictType: {
        defaultValue: queryDataRef.current?.dictType,
      },
      dictCode: {
        defaultValue: queryDataRef.current?.dictCode,
      },
      dictValue: {
        defaultValue: queryDataRef.current?.dictValue,
      },
      dictState: {
        defaultValue: queryDataRef.current?.dictState,
      },
    }),

    [],
  );

  const store = useStore<FormType>(formConfigs);
  const { Form, Item } = useForm(store);
  const columnDefs = useMemo<ColumnDefs>(() => {
    return [
      {
        headerName: '编码',
        field: 'dictCode',
      },
      {
        headerName: '名称',
        field: 'dictValue',
      },
      {
        headerName: '类型',
        field: 'dictType',
      },
      {
        headerName: '启用状态',
        field: 'dictState',

        cellRendererFramework: ({ value }: { value: any }) => {
          return value === enableState.enable ? (
            <Badge status="success" text="已启用" />
          ) : (
            <Badge status="error" text="暂未启用" />
          );
        },
      },
      {
        headerName: '描述',
        field: 'dictDesc',
      },
      {
        headerName: '操作',
        sortable: false,
        pinned: 'right',
        cellRendererFramework: ({ data }: { data: any }) => {
          return (
            <div className="list-act">
              <span
                onClick={() => {
                  setInfo(data);
                  setVisible(true);
                }}
              >
                详情
              </span>
              {data.dictState === enableState.enable ? (
                <span
                  className="danger"
                  onClick={() => {
                    Modal.confirm({
                      title: '是否注销该字典',
                      onOk: () => {
                        return switchCommonDict(
                          data.dictId,
                          enableState.disabled,
                        )
                          .then(resp => {
                            if (resp.isSuccess) message.success(resp.msg);
                            else message.error(resp.msg);
                          })
                          .finally(() => {
                            if (gridRef.current) {
                              gridRef.current.fetch({});
                            }
                          });
                      },
                    });
                  }}
                >
                  注销
                </span>
              ) : (
                <span
                  className="danger"
                  onClick={() => {
                    Modal.confirm({
                      title: '是否启用该字典',
                      onOk: () => {
                        return switchCommonDict(data.dictId, enableState.enable)
                          .then(resp => {
                            if (resp.isSuccess) message.success(resp.msg);
                            else message.error(resp.msg);
                          })
                          .finally(() => {
                            if (gridRef.current) {
                              gridRef.current.fetch({});
                            }
                          });
                      },
                    });
                  }}
                >
                  启用
                </span>
              )}
            </div>
          );
        },
      },
    ];
  }, []);
  const infoRef = useRef<InfoRef>();
  return (
    <div className="search-layout">
      <div className="search-area">
        <Form layout={horizontal}>
          <Item text="类型" id="dictType">
            <Select requestMethod={loadDictType} />
          </Item>
          <Item id="dictCode" text="编码">
            <Input />
          </Item>
          <Item id="dictValue" text="名称">
            <Input />
          </Item>
          <Item id="dictState" text="启用状态">
            <Select options={enableOptions} />
          </Item>
          <Col span={24}>
            <div className="search-btns">
              <Button
                type="primary"
                htmlType="submit"
                onClick={e => {
                  e.preventDefault();
                  setQueryData(store.getValues());
                  gridRef.current?.fetch({
                    page: 1,
                  });
                }}
              >
                查询
              </Button>
              <Button
                onClick={() => {
                  setQueryData({});
                  store.setAllValues(queryDataRef.current);
                  gridRef.current?.fetch({
                    page: 1,
                  });
                }}
              >
                重置
              </Button>
              g
              <Button
                type="primary"
                onClick={() => {
                  setVisible(true);
                }}
              >
                新增
              </Button>
            </div>
          </Col>
        </Form>
      </div>
      <Modal
        destroyOnClose
        visible={visible}
        title="通用字典详情"
        onCancel={() => {
          setInfo({});
          setVisible(false);
        }}
        footer={
          info.dictState === enableState.disabled ? null : (
            <Button
              type="primary"
              onClick={() => {
                if (infoRef.current) {
                  infoRef.current.submit(() => {
                    setInfo({});
                    setVisible(false);
                    if (gridRef.current) gridRef.current.fetch({});
                  });
                }
              }}
            >
              确认
            </Button>
          )
        }
      >
        <Info id={info.dictId} ref={infoRef} />
      </Modal>
      <DataGrid
        fetchUrl="/config/dict/common/"
        columnDefs={columnDefs}
        {...gridProps}
      />
    </div>
  );
};

export default inject(({ global }) => ({
  menuId2Url: global.menuId2Url,
}))(CommonDict);
