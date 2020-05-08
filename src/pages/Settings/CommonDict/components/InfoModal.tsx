import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Spin, message, Input } from 'antd';
import { useForm, Modal, useStore, Select } from 'teaness';
import { respCode, verticalColProps } from '@/constant';
import {
  getCommonDict,
  newCommonDict,
  addCommonDict,
  updateCommonDict,
} from '@/service/config';
import { loadDictType } from '@/combination';
import styles from '../index.scss';

export interface InfoProps {
  id?: string;
}

export interface InfoRef {
  submit: (success?: () => void) => void;
}

interface FormType {
  dictType: string;
  dictCode: string;
  dictValue: string;
  dictSeq: number;
  dictDesc: string;
}
const Info: React.ForwardRefRenderFunction<any, InfoProps> = (props, ref) => {
  const { id } = props;
  const [info, setInfo] = useState<Partial<FormType>>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (id) {
      getCommonDict(id).then(resp => {
        if (resp.code === respCode.success) setInfo(resp.data);
        else Modal.error({ title: resp.msg });
      });
    } else {
      newCommonDict().then(resp => {
        if (resp.code === respCode.success) setInfo(resp.data);
        else Modal.error({ title: resp.msg });
      });
    }
    setLoading(false);
  }, [id]);
  const formStore = useStore<FormType>(
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
  );
  const { Form, Item } = useForm(formStore);
  useImperativeHandle(
    ref,
    () => ({
      submit: (success?: () => void) => {
        formStore.submit(async ({ values, errs }) => {
          if (!errs) {
            let resp;
            if (id) {
              resp = await updateCommonDict({
                ...info,
                ...values,
              });
            } else {
              resp = await addCommonDict({
                ...info,
                ...values,
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
    [formStore, info],
  );

  return (
    <div className={styles.normal}>
      <Spin spinning={loading}>
        <Form
          layout={{
            ...verticalColProps,
            style: {
              maxWidth: 500,
              margin: '0 auto',
            },
          }}
        >
          <Item id="dictType" required text="类型">
            <Select requestMethod={loadDictType} disabled={!!props.id} />
          </Item>
          <Item id="dictCode" required text="编码">
            <Input disabled={!!props.id} />
          </Item>
          <Item id="dictValue" required text="名称">
            <Input />
          </Item>
          <Item id="dictSeq" text="排序">
            <Input />
          </Item>
          <Item id="dictDesc" text="描述">
            <Input />
          </Item>
        </Form>
      </Spin>
    </div>
  );
};

export default forwardRef(Info);
