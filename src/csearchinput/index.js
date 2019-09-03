import { Select } from 'antd';
import { httpRequest } from '../redux/reducers';
import { getJSONData } from '../utils';
const { Option } = Select;

class SearchInput extends React.Component {
  state = {
    data: [],
    value: undefined,
  };

  static defaultProps = {
    keyParameter: "key",
    nameParameter: "name",
    url: '',
    disabled: false,
    queryParam: 'name'
  };

  componentDidMount() {
    this.handleSearch('');
  }

  
  queryRequest = (value, callback) => {
    const { url, queryParam, keyParameter, nameParameter,param } = this.props;
    let paramRequest = !!param?param:{};
    paramRequest[queryParam] = value;
    httpRequest(url, 'GET', paramRequest, null).then(function (response) {
      let responseData = getJSONData(response.data);
      let responseValue = responseData.data;
      if (!!responseValue && Array.isArray(responseValue)) {
        let op = [];
        responseValue.forEach(item => {
          op.push({
            value: item[keyParameter],
            text: item[nameParameter]
          });
        });
        if (!!callback) {
          callback(op);
        }
      }
      else {
        if (!!callback) {
          callback([]);
        }
      }
    })
  }

  handleSearch = value => {
    let v = !!value ? value : '';
    const {disabled} = this.props;
    if(!!!disabled)
    {
      this.queryRequest(v, data => this.setState({ data }));
    }
  

  };

  handleChange = value => {
    this.setState({ value });
    const { onChange, onChangeValue } = this.props;
    if (!!onChange) {
      onChange(value);
    }
    if (!!onChangeValue) {
      onChangeValue(value);
    }
  };

  render() {
    const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);
    return (
      <Select
        disabled={this.props.disabled}
        showSearch
        allowClear
        value={this.state.value}
        placeholder={this.props.placeholder}
        style={this.props.style}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        notFoundContent={null}
        onFocus={this.handleSearch}
      >
        {options}
      </Select>
    );
  }
}
export default SearchInput