import React, { useContext } from 'react';
import classnames from 'classnames';
import FormContext from 'teaness/es/Form/Context/FormContext';
import { searchRequired } from 'teaness/es/Form/utils';

export interface LabelProps {
  id?: string;
  text?: string;
  className?: string;
  required?: boolean;
  renderText?: React.ReactNode;
  style?: React.CSSProperties;
}

const Label: React.FC<LabelProps> = props => {
  const context = useContext(FormContext);
  return (
    <label
      style={props.style}
      title={props.text}
      htmlFor={props.id}
      className={classnames('tea-label', props.className, {
        'label-required':
          props.required ??
          (props.id && searchRequired(props.id, context.store)),
      })}
    >
      {props.renderText ?? props.text} :
    </label>
  );
};

export default Label;
