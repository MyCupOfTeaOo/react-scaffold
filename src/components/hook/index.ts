import {
  useState,
  useCallback,
  useEffect,
  DependencyList,
  useRef,
} from 'react';
import { ReqResponse } from '@/utils/request';
import { message, Modal } from 'antd';

export interface PaginationOptions {
  defaultCurrent?: number;
  defaultPageSize?: number;
  defaultTotal?: number;
}

export function usePagination(options?: PaginationOptions) {
  const [current, setCurrent] = useState(options?.defaultCurrent ?? 1);
  const [pageSize, setPageSize] = useState(options?.defaultPageSize ?? 10);
  const [total, setTotal] = useState(options?.defaultTotal);
  const showTotal = useCallback((item: number, range: [number, number]) => {
    return range[1] !== 0
      ? `${range[0]}-${range[1]} 共 ${item} 条数据`
      : '暂无数据';
  }, []);

  const onChange = useCallback((page: number, size?: number) => {
    setCurrent(page);
    if (size) setPageSize(size);
  }, []);
  return {
    current,
    pageSize,
    onChange,
    onShowSizeChange: onChange,
    showSizeChanger: true,
    showQuickJumper: true,
    size: 'small',
    total,
    setTotal,
    showTotal,
  };
}

export interface Option {
  label: string;
  value: any;
  children?: Option[];
}

export function optionsFilter<T extends Option>(
  options: T[] | undefined,
  callback: (option: T) => boolean,
): T[] | undefined {
  return options
    ?.filter(option => {
      return callback(option);
    })
    .map(option => ({
      ...option,
      children: optionsFilter(option.children as T[], callback),
    }));
}

export function useOptions<T extends Option>(
  loadFunc: () => Promise<Option[]> & {
    cancel: () => void;
  },
  deps?: DependencyList,
  otherOptions?: {
    pattern?: RegExp;
  },
): T[] | undefined {
  const [options, setOptions] = useState<T[]>();
  const pattern = otherOptions?.pattern;
  useEffect(() => {
    const req = loadFunc();
    req
      .then(res => {
        setOptions(res as T[]);
      })
      .catch(err => {
        Modal.error({
          content: err,
        });
      });
    return req.cancel;
  }, deps);
  if (pattern) {
    return optionsFilter(options, option => pattern.test(option.value));
  }
  return options;
}

type GetResponseDataType<
  T extends Promise<ReqResponse<any>>
> = T extends Promise<ReqResponse<infer R>> ? R : any;

type GetResponseType<T extends Promise<ReqResponse<any>>> = T extends Promise<
  infer R
>
  ? R
  : any;

export function useMound() {
  const mound = useRef(true);
  useEffect(() => {
    return () => {
      mound.current = false;
    };
  }, []);
  return mound;
}

export function useRequest<
  T extends any = any,
  F extends (...args: any) => Promise<ReqResponse<T>> = (
    ...args: any
  ) => Promise<ReqResponse<T>>
>(
  requset: F,
  options: {
    params?: Parameters<F>;
    showSuccess?: boolean;
    showError?: boolean;
    cancel?: () => void;
    first?: boolean;
    onSuccess?: (args: GetResponseType<ReturnType<F>>) => void;
    onError?: (args: GetResponseType<ReturnType<F>>) => void;
  } = {},
  deps?: DependencyList,
) {
  const {
    showError = true,
    showSuccess = !options.first,
    cancel,
    first,
    onSuccess,
    onError,
  } = options;
  const mound = useMound();
  const [count, setCount] = useState(first ? 1 : 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [data, setData] = useState<GetResponseDataType<ReturnType<F>>>();
  const paramsRef = useRef<Parameters<F> | undefined>(options.params);
  const run = useCallback((...p: Parameters<F>) => {
    paramsRef.current = p;
    setCount(prevCount => prevCount + 1);
  }, []);
  const reload = useCallback(() => {
    setCount(prevCount => prevCount + 1);
  }, [run]);
  useEffect(() => {
    paramsRef.current = options.params;
  }, deps || []);
  useEffect(() => {
    if (count < 1) return;
    setLoading(true);
    requset(...((paramsRef.current as any) || []))
      .then(res => {
        if (res.isSuccess) {
          setSuccess(res.msg);
          setData(res.data as any);
          if (showSuccess) {
            message.success(res.msg);
          }
          if (onSuccess) {
            onSuccess(res as any);
          }
        } else {
          setError(res.msg);
          if (showError) {
            Modal.error({
              content: res.msg,
            });
          }
          if (onError) {
            onError(res as any);
          }
        }
      })
      .catch(err => {
        setError(err);
        if (showError) {
          Modal.error({
            content: err,
          });
        }
      })
      .finally(() => {
        if (mound.current) setLoading(false);
      });
    return cancel;
  }, [count, ...(deps || [])]);
  return {
    loading,
    data,
    setData,
    success,
    error,
    run,
    paramsRef,
    reload,
  };
}

export interface UseGridOption {
  /**
   * 默认 grid
   */
  gridId: string;
}
