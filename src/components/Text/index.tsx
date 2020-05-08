import React from 'react';
import numeral from 'numeral';

export interface NumberTextProps {
  value?: any;
  format?: Parameters<Numeral['format']>;
}

const NumberText: React.FC<NumberTextProps> = ({
  value,
  format = ['0.00'],
}) => <div>{numeral(value).format(...format)}</div>;
export default NumberText;
