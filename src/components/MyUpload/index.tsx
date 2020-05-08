import React, {
  useState,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import lodash from 'lodash';
import { UploadContext, Circle, Switch, Show } from 'teaness';
import numeral from 'numeral';
import {
  UploadProps,
  UploadFile,
  UploadRefType,
  UploadChangeParam,
} from 'teaness/es/Form/Components/Upload/typings';
import { Upload, message, Button, Popover } from 'antd';
import { Registry, handlePreview } from 'teaness/es/Form/Components/Upload';
import { ButtonType } from 'antd/lib/button';
import styles from './index.scss';

function statusToType(status?: string): ButtonType | undefined {
  switch (status) {
    case 'error':
      return 'danger';
    case 'success':
    case 'done':
      return 'primary';
    default:
      return undefined;
  }
}

const MyUpload: React.FC<UploadProps & {
  btnProps?: Button['props'];
  // 不仅隐藏filelist,还会不填充filelist
  showFileList?: boolean;
}> = props => {
  const {
    value,
    onChange,
    onSelect,
    getInfoErrorback,
    getFileInfo: g,
    children,
    loading,
    maxSize,
    max,
    onUpload,
    btnProps,
    showFileList,
    ...rest
  } = props;
  const context = useContext(UploadContext);
  const memo = useMemo(
    () => ({
      unmount: false,
      uniqueId: lodash.uniqueId('upload'),
    }),
    [],
  );
  const [loadings, setLoadings] = useState<{ [key: string]: boolean }>({});
  const isLoading = useMemo(() => Object.keys(loadings).length > 0, [loadings]);
  const getFileInfo = useMemo(() => g || Registry.getFileInfo, [g]);
  const [fileList, setFileList] = useState<UploadFile[]>();
  const validRegex = useMemo(() => {
    if (props.accept) {
      return new RegExp(
        props.accept.replace(/\*|^\.|(?<=,)./g, '.*').replace(/,/g, '|'),
        'i',
      );
    }
  }, [props.accept]);
  const handle = useCallback(
    (info: UploadChangeParam) => {
      const target = info.fileList.find(item => item.uid === info.file.uid);
      setFileList(prevFileList => {
        // 已上传删除的可能会这样
        if (!target) {
          if (onChange && value && info.file.status === 'removed') {
            const fl = value.split(',');
            const r = fl.filter(item => item !== info.file.uid).join(',');
            onChange(lodash.isEmpty(r) ? undefined : r);
          }
          if (prevFileList) return prevFileList.filter(item => item.uid !== info.file.uid);
          else return undefined;
        }

        // 删除
        if (target.status === 'removed') {
          if (onChange && value) {
            const fl = value.split(',');
            const r = fl.filter(item => item !== info.file.uid).join(',');
            onChange(lodash.isEmpty(r) ? undefined : r);
          }
          if (prevFileList) return prevFileList.filter(item => item.uid !== target.uid);
          else return undefined;
        }
        // 大小判断
        if (maxSize) {
          if (target.size / 1024 > maxSize) {
            message.error(`文件最大只能上传${maxSize}KB`);
            return prevFileList;
          }
        }
        // 文件类型判断或者文件后缀
        if (
          validRegex &&
          !(validRegex.test(target.type) || validRegex.test(target.name))
        ) {
          message.error('文件类型错误');
          return prevFileList;
        }
        // 增加
        if (prevFileList) {
          if (max && prevFileList.length === max) {
            // 多文件时可能会超过max

            // 需要判断这一个是不是value的
            const first = prevFileList[0];
            if (value && onChange) {
              const fl = value.split(',');
              const r = fl.filter(item => item !== first.uid).join(',');
              onChange(lodash.isEmpty(r) ? undefined : r);
            }

            return prevFileList.slice(1).concat([target]);
          }
          return prevFileList.concat([target]);
        } else {
          return [target];
        }
      });
      if (onSelect) onSelect(info);
    },
    [onChange, value, validRegex],
  );

  useEffect(() => {
    let unmount = false;
    const oldFileList: UploadFile[] = [];
    if (value && getFileInfo) {
      const uids = value.split(',');
      const all = uids.map(uid => {
        if (fileList) {
          const target = fileList.find(file => file.uid === uid);
          if (target) {
            oldFileList.push(target);
            const t = Promise.resolve({
              size: target.size,
              name: target.name,
              type: target.type,
              url: target.url,
            }) as Promise<{
              size: number;
              name: string;
              type: string;
              url: string;
            }> & {
              cancel: () => void;
            };
            t.cancel = () => {};
            return t;
          }
        }
        setLoadings(prev => ({
          ...prev,
          [uid]: true,
        }));
        return getFileInfo(uid);
      });
      // 清空
      setFileList(oldFileList);
      all.forEach((resp, index) => {
        const uid = uids[index];
        resp
          .then(item => {
            if (unmount) return;
            setFileList(prevFileList => {
              if (Array.isArray(prevFileList)) {
                if (prevFileList.every(prevFile => prevFile.uid !== uid)) {
                  return prevFileList.concat([
                    {
                      uid,
                      size: item.size,
                      name: item.name,
                      url: item.url,
                      type: item.type,
                      status: 'done',
                    },
                  ]);
                } else {
                  return prevFileList;
                }
              } else {
                return [
                  {
                    uid,
                    size: item.size,
                    name: item.name,
                    url: item.url,
                    type: item.type,
                    status: 'done',
                  },
                ];
              }
            });
          })
          .catch(err => {
            if (unmount) return;
            setFileList(prevFileList => {
              if (Array.isArray(prevFileList)) {
                return prevFileList.concat([
                  {
                    uid,
                    name: '文件信息加载失败',
                    size: 0,
                    status: 'error',
                    type: 'null',
                  },
                ]);
              } else {
                return [
                  {
                    uid,
                    name: '文件信息加载失败',
                    size: 0,
                    status: 'error',
                    type: 'null',
                  },
                ];
              }
            });
            if (getInfoErrorback) getInfoErrorback(uid, err);
            else console.error('文件信息加载失败', err);
          })
          .finally(() => {
            if (!memo.unmount) setLoadings(prev => lodash.omit(prev, uid));
          });
      });
      return () => {
        unmount = true;
        all.forEach(item => item.cancel());
      };
    } else {
      setFileList(undefined);
    }
  }, [value]);
  useEffect(() => {
    return () => {
      memo.unmount = true;
    };
  }, []);
  useEffect(() => {
    const temp: UploadRefType = {
      uniqueId: memo.uniqueId,
      fileList,
      setFileList,
      add: (values: string[]) => {
        if (props.onChange && values.length > 0) {
          if (value) {
            props.onChange(`${value},${values.join(',')}`);
          } else {
            props.onChange(values.join(','));
          }
        }
      },
      onUpload,
    };
    if (context.register) {
      context.register(temp);

      return () => {
        if (context.unregister) {
          context.unregister(temp);
        }
      };
    }
  }, [context, fileList, setFileList, value]);
  useEffect(() => {
    // 为了文件直接上传
    const req = context.upload();
    req.finally(() => {
      // 隐藏filelist
      if (!memo.unmount && !showFileList) {
        setFileList(undefined);
      }
    });
    return req.cancel;
  }, [fileList]);
  const beforeUpload = useCallback(() => false, []);
  const child = useMemo(() => {
    if (isLoading) return loading;
    if (!max) {
      return (
        children || (
          <Button size="small" icon="upload" disabled={props.disabled}>
            上传
          </Button>
        )
      );
    }
    if (!fileList) {
      return (
        children || (
          <Button size="small" icon="upload" disabled={props.disabled}>
            上传
          </Button>
        )
      );
    }
    if (fileList.length < max) {
      return (
        children || (
          <Button size="small" icon="upload" disabled={props.disabled}>
            上传
          </Button>
        )
      );
    }
    return undefined;
  }, [children, fileList, isLoading, loading, props.disabled]);
  const onPreview = useCallback(file => handlePreview(file, props.listType), [
    props.listType,
  ]);
  return (
    <Upload
      onPreview={onPreview}
      onDownload={Registry.onDownLoad}
      beforeUpload={beforeUpload}
      fileList={fileList}
      onChange={handle}
      {...rest}
    >
      <Show actual={showFileList} expect>
        {fileList?.map(file => (
          <div
            key={file.uid}
            onClick={e => {
              if (((e.target as any)?.type as string) !== 'button') e.stopPropagation();
            }}
          >
            <Popover
              trigger="hover"
              title={
                <div className={styles.title}>
                  <span>文件信息</span>
                  <Show actual={!props.disabled} expect>
                    <Button
                      type="danger"
                      size="small"
                      onClick={e => {
                        // eslint-disable-next-line
                        file.status = 'removed';
                        handle({
                          fileList,
                          file,
                        });
                        e.stopPropagation();
                      }}
                    >
                      删除
                    </Button>
                  </Show>
                </div>
              }
              content={
                <ul className={styles.fileInfo}>
                  <li>
                    <strong>文件名:&nbsp;</strong> {file.name}
                  </li>
                  <li>
                    <strong>文件类型:&nbsp;</strong> {file.type}
                  </li>
                  <li>
                    <strong>文件大小:&nbsp;</strong>
                    {numeral(file.size / 1024 / 1024).format('0.00')}M
                  </li>
                  <li>
                    <strong>状态:&nbsp;</strong>
                    <Switch actual={file.status}>
                      <Switch.Case expect="done">
                        <span className="success">已上传</span>
                      </Switch.Case>
                      <Switch.Case expect="success">
                        <span className="success">上传成功</span>
                      </Switch.Case>
                      <Switch.Case expect="error">
                        <span className="danger">上传失败</span>
                      </Switch.Case>
                      <Switch.Case expect="uploading">
                        <span className="normalText">正在上传</span>
                      </Switch.Case>
                      <Switch.Case expect="removed">
                        <span className="danger">已删除</span>
                      </Switch.Case>
                      <Switch.Case>
                        <span className="warning">待上传</span>
                      </Switch.Case>
                    </Switch>
                  </li>
                </ul>
              }
            >
              <Button
                shape="round"
                disabled={
                  props.disabled && !(file.status && file.status !== 'error')
                }
                type={statusToType(file.status)}
                onClick={e => {
                  if (file.status !== 'error') {
                    if (Registry.onDownLoad) Registry.onDownLoad(file);
                    e.stopPropagation();
                  }
                }}
                size="small"
                {...btnProps}
              >
                <Switch actual={file.status}>
                  <Switch.Case expect="error">重新上传</Switch.Case>
                  <Switch.Case expect={v => v && v !== 'error'}>
                    查看附件
                  </Switch.Case>
                  <Switch.Case>附件待上传</Switch.Case>
                </Switch>
              </Button>
            </Popover>
          </div>
        ))}
      </Show>
      {child}
    </Upload>
  );
};

MyUpload.defaultProps = {
  showUploadList: false,
  showFileList: true,
  loading: (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Circle style={{ width: 24 }} />
      文件信息加载中...
    </div>
  ),
};

export default MyUpload;
