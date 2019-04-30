import { FormGroup } from '@blueprintjs/core';
import validator from 'validator';

export default (config = {}) => {
  return inputGroupEl => {
    const { onChange } = inputGroupEl.props;
    const preOnChangeHandleList = [];
    if (config.rules && config.rules.findIndex((r = {}) => r.required === true)) {
      const requiredRule = rules.find(r => r.required);
      const emailRule = rules.find(r => r.isEmail);
      const urlRule = rules.find(r => r.isURL);
      const mobilePhoneRule = rules.find(r => r.isMobilePhone);
      inputGroupEl.props.onChange = e => {
        
      };
      // @TODO
    }
  };
};
