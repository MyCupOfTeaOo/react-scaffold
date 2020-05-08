import React, {
  useMemo,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Spin, message, Alert, Input, Modal } from 'antd';
import { useForm, useStore, Select, Cascader, vertical } from 'teaness';
import { InputProps } from 'antd/lib/input';
import { respCode } from '@/constant';
import { loadCascadeType } from '@/combination';
import {
  loadChildDict,
  getCascadeDict,
  newCascadeDict,
  updateCascadeDict,
  addCascadeDict,
} from '@/service/config';
import styles from '../index.scss';

export interface InfoProps {
  id?: string;
}

export interface InfoRef {
  submit: (success?: () => void) => void;
}

interface FormType {
  dictType: string;
  fatherCode: string;
  dictCode: string;
  dictValue: string;
  dictSeq: number;
  dictDesc: string;
}

interface CompactInputProps extends Omit<InputProps, 'value' | 'onChange'> {
  fatherCode?: string;
}

const CompactInput: React.FC<CompactInputProps> = props => {
  const { fatherCode, ...rest } = props;

  return (
    <Input.Group
      style={{
        display: 'flex',
      }}
    >
      <Input value={fatherCode} disabled />
      <Input {...rest} />
    </Input.Group>
  );
};

const Info: React.ForwardRefRenderFunction<any, InfoProps> = (props, ref) => {
  const { id } = props;
  const [info, setInfo] = useState<Partial<FormType>>({});
  const [fatherCode, setFatherCode] = useState<string>();

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (id) {
      getCascadeDict(id).then(resp => {
        if (resp.code === respCode.success) {
          const l = (resp.data.dictCode as string).split('-');
          setInfo({
            ...resp.data,
            dictCode: l[l.length - 1],
          });
          setFatherCode(resp.data.fatherCode);
        } else Modal.error({ title: resp.msg });
      });
    } else {
      newCascadeDict().then(resp => {
        if (resp.code === respCode.success) setInfo(resp.data);
        else Modal.error({ title: resp.msg });
      });
    }
    setLoading(false);
  }, [id]);
  const [fatherType, setFatherType] = useState<string>();

  const store = useStore<FormType>(
    {
      dictType: {
        defaultValue: info.dictType,
        rules: [
          {
            required: true,
            message: '必填',
          },
        ],
      },
      fatherCode: {
        defaultValue: info.fatherCode,
      },
      dictCode: {
        defaultValue: info.dictCode,
        rules: [
          {
            required: true,
            message: '必填',
          },
          {
            pattern: '^[\\u4e00-\\u9fa5a-zA-Z0-9]*$',
            message: '编码只可以是中英文或者数字',
          },
        ],
      },
      dictValue: {
        defaultValue: info.dictValue,
        rules: [
          {
            required: true,
            message: '必填',
          },
        ],
      },
      dictSeq: {
        defaultValue: info.dictSeq,
      },
      dictDesc: {
        defaultValue: info.dictDesc,
      },
    },
    [info],
    {
      autoHandle: [
        {
          listenKey: ['dictType'],
          effect: values => {
            setFatherType(values.dictType);
          },
        },
        {
          listenKey: ['fatherCode'],
          effect: values => {
            setFatherCode(values.fatherCode);
          },
        },
      ],
    },
  );
  const { Form, Item } = useForm(store);
  const loadFatherCascader = useMemo(() => {
    if (fatherType) return loadChildDict(fatherType);
    if (info.dictType && !store.isChange) return loadChildDict(info.dictType);
    return undefined;
  }, [fatherType, info]);

  useImperativeHandle(
    ref,
    () => ({
      submit: (success?: () => void) => {
        store.submit(async ({ values, errs }) => {
          if (!errs) {
            let resp;
            if (id) {
              resp = await updateCascadeDict({
                ...info,
                ...values,
                dictCode: values.fatherCode
                  ? `${values.fatherCode}-${values.dictCode}`
                  : values.dictCode,
              });
            } else {
              resp = await addCascadeDict({
                ...info,
                ...values,
                dictCode: values.fatherCode
                  ? `${values.fatherCode}-${values.dictCode}`
                  : values.dictCode,
              });
            }
            if (resp.code === respCode.success) {
              message.success(resp.msg);
              if (success) success();
            } else {
              Modal.error({
                title: resp.msg,
              });
            }
          }
        });
      },
    }),
    [store, info],
  );

  return (
    <div className={styles.normal}>
      <Spin spinning={loading}>
        <Form layout={vertical}>
          <Item text="类型" id="dictType">
            <Select requestMethod={loadCascadeType} disabled={!!props.id} />
          </Item>
          <Item text="父级字典" id="fatherCode">
            {p => (
              <React.Fragment>
                <Alert
                  message="必须先选择类型,才会加载父级字典"
                  type="warning"
                  showIcon
                />
                <Cascader
                  changeOnSelect
                  requestMethod={loadFatherCascader}
                  disabled={!!props.id}
                  {...p}
                />
              </React.Fragment>
            )}
          </Item>
          <Item required text="编码" id="dictCode">
            <CompactInput fatherCode={fatherCode} disabled={!!props.id} />
          </Item>
          <Item required text="名称" id="dictValue">
            <Input />
          </Item>
          <Item text="排序" id="dictSeq">
            <Input />
          </Item>
          <Item text="描述" id="dictDesc">
            <Input />
          </Item>
        </Form>
      </Spin>
    </div>
  );
};

export default forwardRef(Info);
