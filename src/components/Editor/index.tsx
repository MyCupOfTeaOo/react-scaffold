import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
  useMemo,
} from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import DocumoentEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn';
import UploadAdapter from './UploadAdapter';
import './index.scss';

// TODO zouwendi 以后有时间给他写类型,api 先去看ckeditor文档
// https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/react.html
export type EditorProps = any;

const defaultConfig = {
  language: 'zh-cn',
  fontFamily: {
    options: [
      'default',
      'Verdana, Geneva, Arial, Helvetica, sans-serif, 宋体',
      'Arial, Helvetica, sans-serif',
      'Courier New, Courier, monospace',
      'Georgia, serif',
      'Lucida Sans Unicode, Lucida Grande, sans-serif',
      'Tahoma, Geneva, sans-serif',
      'Times New Roman, Times, serif',
      'Trebuchet MS, Helvetica, sans-serif',
    ],
  },
};

const Editor: React.ForwardRefRenderFunction<any, EditorProps> = (
  props,
  ref,
) => {
  const ckeditorRef = useRef<any>();
  const valueRef = useRef<any>();
  valueRef.current = props.value;
  useImperativeHandle(
    ref,
    () => {
      return ckeditorRef.current;
    },
    [],
  );

  const { config, onChange, value, onInit, ...rest } = props;
  const handle = useCallback(
    (_, editor) => {
      const data = editor.getData();
      if (data === valueRef.current) return;
      if (!data && !valueRef.current) return;
      onChange(data);
    },
    [onChange],
  );
  const onInitHandle = useCallback(
    (editor: any) => {
      // Insert the toolbar before the editable area.
      editor.ui
        .getEditableElement()
        .parentElement.insertBefore(
          editor.ui.view.toolbar.element,
          editor.ui.getEditableElement(),
        );
      // eslint-disable-next-line
      editor.plugins.get('FileRepository').createUploadAdapter = (
        loader: any,
      ) => {
        return new UploadAdapter(loader);
      };
      if (onInit) onInit(editor);
    },
    [onInit],
  );
  const mergeConfig = useMemo(
    () => ({
      ...defaultConfig,
      ...config,
    }),
    [config],
  );
  return (
    <CKEditor
      ref={ckeditorRef}
      onInit={onInitHandle}
      config={mergeConfig}
      data={value ?? ''}
      editor={DocumoentEditor}
      onChange={handle}
      {...rest}
    />
  );
};

export default forwardRef(Editor);
