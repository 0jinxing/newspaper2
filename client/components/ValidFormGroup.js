import React from 'react';
import { FormGroup, Intent } from '@blueprintjs/core';
import validator from 'validator';

Reflect.set(validator, 'isNotEmpty', (...args) => {
  return !validator.isEmpty(...args);
});

class ValidFormGroup extends React.Component {
  state = {
    helperText: null,
    intent: null,
  };
  render() {
    const { rules = [], children } = this.props;
    const { helperText, intent } = this.state;

    const _onChange = e => {
      if (children.props.onChange) children.props.onChange(e);
      const value = e.target.value;
      // @TODO 待优化，节流
      for (let i = 0, len = rules.length; i < len; i++) {
        const rule = rules[i];
        const validFn = validator[rule.type];
        if (typeof validFn === 'function' && !validFn.call(validator, value)) {
          this.setState({
            helperText: rule.message || '校验不通过',
            intent: Intent.DANGER,
          });
          return;
        }
      }
      this.setState({
        helperText: null,
        intent: null,
      });
    };
    const _children = React.cloneElement(children, {
      onChange: _onChange,
      intent,
    });

    return (
      <FormGroup {...this.props} helperText={helperText} intent={intent}>
        {_children}
      </FormGroup>
    );
  }
}

export default ValidFormGroup;
