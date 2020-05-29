import React, { useMemo } from 'react';
import { Button, Input } from 'antd';
import {
  useForm,
  DataGrid,
  useStore,
  Col,
  useDataGrid,
  horizontal,
  FoldCard,
} from 'teaness';
import { inject } from 'mobx-react';
import { ColumnDefs } from 'teaness/es/DataGrid/typings';
import { RouteProps } from '@/typings';
import { MenuId2Url } from '@/stores/Global';
import { joinPath } from '@/utils/utils';
import { Link } from 'umi';

export interface ProjectListProps extends RouteProps {
  menuId2Url: MenuId2Url;
}

interface Project {
  _id: string;
  name: string;
  description?: string;
}

const ProjectList: React.FC<ProjectListProps> = props => {
  const { gridProps, gridRef, setQueryData, queryDataRef } = useDataGrid<
    Project
  >({
    location: props.location,
    historyId: 'grid',
  });

  const store = useStore<Partial<Project>>(
    {
      name: {
        defaultValue: queryDataRef.current.name,
      },
    },
    [],
  );
  const { Form, Item } = useForm(store);
  const columnDefs = useMemo<ColumnDefs>(() => {
    return [
      {
        headerName: '名称',
        field: 'name',
        suppressSizeToFit: true,
      },
      {
        headerName: '描述',
        field: 'description',
      },
      {
        headerName: '操作',
        pinned: 'right',
        suppressSizeToFit: true,
        cellRendererFramework({ data }: { data: Project }) {
          return (
            <div className="list-act">
              <Link
                to={{
                  pathname: joinPath(props.match.url, data._id),
                }}
              >
                配置
              </Link>
            </div>
          );
        },
      },
    ];
  }, []);
  return (
    <div className="search-layout">
      <FoldCard title="查询条件">
        <Form layout={horizontal}>
          <Item id="name" text="项目名称">
            <Input />
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
            </div>
          </Col>
        </Form>
      </FoldCard>
      <DataGrid
        fetchUrl="/proj/projects/search"
        columnDefs={columnDefs}
        onRowDataChanged={grid => {
          grid.api.sizeColumnsToFit();
        }}
        {...gridProps}
      />
    </div>
  );
};

export default inject(({ global }) => ({
  menuId2Url: global.menuId2Url,
}))(ProjectList);
