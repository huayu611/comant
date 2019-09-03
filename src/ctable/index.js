import React, { PureComponent, Fragment } from 'react';
import { Table, Alert } from 'antd';
import { getDefaultPagingSize } from "../utils";


function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

class CustStandardTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);
    this.state = {
      selectedRowKeys: [],
      needTotalList,
    };
  }
  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };


  render() {
    const { selectedRowKeys, needTotalList } = this.state;
    const { data = {}, propKey,rowKey, ...rest} = this.props;
    const { totalnum,currentPage,onPageChange,nopage,defaultPageSize  } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true
    };
    if(!!totalnum)
    {
      paginationProps["total"] = totalnum;
    }

    if(!!currentPage)
    {
      paginationProps["current"] = currentPage;
    }
    if(!!onPageChange)
    {
      paginationProps["onChange"] = onPageChange;
      paginationProps["onShowSizeChange"] = onPageChange;
    }
    
    paginationProps["defaultPageSize"] = defaultPageSize || getDefaultPagingSize();
   
    if(!!nopage)
    {
      
      paginationProps.paging = false;
    }
    else
    {
      paginationProps.paging = true;
    }
    let codeNameKey = propKey || "code";



    return (
      <div>

        <Table
        
          rowKey={rowKey || codeNameKey}
          dataSource={data}
          pagination={paginationProps.paging?paginationProps:false}
          onChange={this.handleTableChange}
          {...rest}
        />
      </div>
    );
  }
}

export default CustStandardTable;
