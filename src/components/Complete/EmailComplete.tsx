import React, { useState } from 'react';
import { autoCompleEmail } from '@/utils/utils';
import { AutoComplete } from 'antd';
import { AutoCompleteProps } from 'antd/lib/auto-complete';

interface EmailProps extends AutoCompleteProps {}

const EmailComplete: React.FC<EmailProps> = props => {
  const [dataSource, setDataSource] = useState<string[]>();
  return (
    <AutoComplete
      dataSource={dataSource}
      onSearch={t => setDataSource(autoCompleEmail(t))}
      {...props}
    />
  );
};

export default EmailComplete;
