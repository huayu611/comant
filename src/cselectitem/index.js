import React, { PureComponent } from 'react';
import { Select } from 'antd';
const { Option } = Select;
class SelectItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = this.props.item
  }
  static defaultProps = {
    keyParameter:"key",
    nameParameter:"name",
    disabled:false
  };
  selectChange = item => {
    const { onChange, ext } = this.props;
    onChange(item, ext);
  };

  onMulSelectChange = item => {
    const { onChange, ext } = this.props;
    onChange(item, ext);
  };
  renderItem(options) {
    const {keyParameter,nameParameter} = this.props;
    let item = [];
    if (options instanceof Array) {
      options.forEach(element => {
        item.push(<Option key={element[keyParameter]} value={element[keyParameter]}>{element[nameParameter]}</Option>);
      });
    }

    return (item);
  }

  render() {
    const { options, value,disabled,mode } = this.props;
    let mul = !!mode && mode === 'multiple';
    return (
      mul?<Select showSearch={true} mode="multiple" disabled={disabled} placeholder="请选择" key={value} value={value} onChange={this.onMulSelectChange} style={{ width: '100%' }}>
        {this.renderItem(options)}
      </Select>
      :<Select showSearch={true}  disabled={disabled} placeholder="请选择" key={value} value={value} onSelect={this.selectChange} style={{ width: '100%' }}>
      {this.renderItem(options)}
    </Select>
    );
  }
}
export default SelectItem;

