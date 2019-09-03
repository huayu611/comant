import React, { Fragment, PureComponent } from 'react';
import { Input } from 'antd';

class NavigationInput extends PureComponent {
  render() {
    const { valuex,valuey, onChange } = this.props;

    return (
      <Fragment>
        <Input
        style={{maxWidth:220,marginRight:8,width:'50%'}}
          value={valuex}
          onChange={e => {
            onChange(e.target.value,valuey);
          }}
        />
        <Input
          style={{maxWidth:220,marginRight:8}}
          onChange={e => {
            onChange(valuey,e.target.value);
          }}
          value={valuey}
        />
      </Fragment>
    );
  }
}

export default NavigationInput;
