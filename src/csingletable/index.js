import { PureComponent, Fragment } from "react";
import CustStandardTable from '../ctable';
import { Button, Modal, Form, Input, Divider, Dropdown, Menu, Icon, Descriptions, PageHeader, DatePicker, InputNumber,Row,Col } from 'antd';
import { getFormNameLength, getFormNamePattern, getFormNameByPattern, checkDataResultWithNotification, getUploadInfo } from '../utils';
import SelectTree from '../cselecttree';
import SelectItem from '../cselectitem';
import ImageUpload from '../cuploadimage'
import TextQuill from '../ctext';
import SearchInput from '../csearchinput';
import moment from 'moment';
const FormItem = Form.Item;

@Form.create()
class SingleTable extends PureComponent {

    static defaultProps = {
        keyParameter: "code",
    };
    state = {
        createVisible: false,
        detailVisible: false,
        modifyVisible: false,
        currentItem: {},
        addButton:false,
        updateButton:false,
    }

    addFunction = (form) => {
        const { add } = this.props;
        let _this = this;
        form.validateFields((err, fieldsValue) => {
            if (err) return;

            if (!!add) {
                _this.setState({addButton:true})
                add(fieldsValue, function (response) {
                    checkDataResultWithNotification(response).then(function () {
                        _this.addVisible(false);
                        _this.setState({addButton:false});
                    }).catch(function(){
                        _this.setState({addButton:false});
                    })

                });
            }
        });
    }
    renderFormItemTheme = (item) => {
        let param = item.param || {};
        switch (item.type) {
            case 'input':
                {
                    return <Input disabled={!!item.disabled && item.disabled} placeholder="请输入" />;
                }
            case 'selectitem':
                {
                    return <SelectItem disabled={!!item.disabled && item.disabled} options={item.option} {...param} placeholder="请选择" />
                }
            case 'mulselectitem':
                {
                    return <SelectItem mode="multiple" disabled={!!item.disabled && item.disabled} options={item.option} {...param} placeholder="请选择" />
                }
            case 'datatime':
                {
                    return <DatePicker disabled={!!item.disabled && item.disabled} style={{ width: '100%' }} showTime placeholder="点击获取时间" />
                }
            case 'date':
                {
                    return <DatePicker disabled={!!item.disabled && item.disabled} style={{ width: '100%' }} placeholder="点击获取时间" />
                }
            case 'textarea':
                {
                    return <Input.TextArea disabled={!!item.disabled && item.disabled} placeholder="请输入" />;
                }
            case 'password':
                {
                    return <Input disabled={!!item.disabled && item.disabled} type="password" placeholder="请输入密码" />;
                }
            case 'selecttree':
                {
                    return <SelectTree disabled={!!item.disabled && item.disabled} {...param} values={item.option} placeholder="请选择" />;
                }
            case 'number':
                {
                    return <InputNumber disabled={!!item.disabled && item.disabled} placeholder="请输入" />;
                }
            case 'uploadimg':
                {
                    return <ImageUpload uploadProp={getUploadInfo(item.option)} />;
                }
            case 'searchselect':
                {
                    return <SearchInput {...item.search} placeholder="请输入" />;
                }
            case 'quill':
                {
                    return <TextQuill {...param} />
                }
            default: {
                return <Input disabled={!!item.disabled && item.disabled} placeholder="请输入" />;
            }
        }
    }

    createDetailData = () => {
        const { detailcolumn, columns, detailcolumnLength = 2, detailName = '详情',detailSize=720 } = this.props;
        const { currentItem } = this.state;
        let dcloumn = detailcolumn || columns;
        let description = [];
        if (Array.isArray(dcloumn)) {
            dcloumn.forEach((item, index) => {
                description.push(<Descriptions.Item key={index} label={item.title}>
                    {!!item.render ? item.render(currentItem[item.dataIndex]) : currentItem[item.dataIndex]}
                </Descriptions.Item>);
            });
        }
        return (<Modal
            destroyOnClose
            title={detailName}
            width={detailSize}
            visible={this.state.detailVisible}
            onOk={() => this.createDetailModal(false, {})}
            onCancel={() => this.createDetailModal(false, {})}
            maskClosable={false}
            footer={null}

        >
            <Descriptions key="key" style={{ marginBottom: 24 }} bordered column={detailcolumnLength}>
                {description}
            </Descriptions>

        </Modal>)
    }

    renderCreateFooterManager = (form) => {

        return [
            <Button loading={this.state.addButton} key="cancel" onClick={() => this.addVisible(false)}>
            关闭
            </Button>,
            <Button loading={this.state.addButton}  key="forward" type="primary" onClick={() => this.addFunction(form)}>
            提交
            </Button>,
        ];
    };

    createNewDataForm = Form.create({ layout: "inline" })(props => {
        const { form, addcolumn, addsize = 720 } = props;
        let newDom = [];
        if (Array.isArray(addcolumn)) {
            addcolumn.forEach(item => {
                let formItem = this.buildFormItem(form, item);
                if (!!formItem) {
                    newDom.push(formItem);
                }
            })
        }
        return (<Modal
            destroyOnClose
            title="新建"
            width={addsize}
            visible={this.state.createVisible}
            footer={this.renderCreateFooterManager(form)}
            onCancel={() => this.addVisible(false)}
            maskClosable={false}
            okText='提交'
            cancelText='关闭'
        >
            <Form >

                {this.buildRolColForm(newDom)}
            </Form>


        </Modal>)

    })

    createNewData = () => {
        const { form, addcolumn, addsize = 720 } = this.props;
        let newDom = [];
        if (Array.isArray(addcolumn)) {
            addcolumn.forEach(item => {
                let formItem = this.buildFormItem(form, item);
                if (!!formItem) {
                    newDom.push(formItem);
                }
            })
        }
        return (<Modal
            destroyOnClose
            title="新建"
            width={addsize}
            visible={this.state.createVisible}
            onOk={this.addFunction}
            onCancel={() => this.addVisible(false)}
            maskClosable={false}
            okText='提交'
            cancelText='关闭'
        >
        {this.buildRolColForm(newDom)}

        </Modal>)
    }

    buildFormItem = (form, item, currentItem) => {
        let condition = item.condition;
        if (!!condition) {

            let key = condition.key;
            let value = condition.value;
            let valueArr = value.split("|");
            if (!!key && !!value) {
                if (Array.isArray(valueArr)) {
                    let ret = false;
                    valueArr.forEach(item => {
                        if (form.getFieldValue(key) === item) {
                            ret = true;
                        }
                    });
                    if (!ret) {
                        return null;
                    }
                }
                else if (form.getFieldValue(key) !== value) {
                    return null;
                }
            }
        }
        return (
            <FormItem className={item.className} labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label={item.title}>
                {form.getFieldDecorator(item.code, this.buildFormOption(item, currentItem))(this.renderFormItemTheme(item))
                   
                }
            </FormItem>
        )
    }

    buildFormOption = (item, currentItem) => {
        let opt = {};
        opt.rules = this.createRuleForFormItem(item);
        if (!!item.value) {
            opt.initialValue = item.value;
        }
        else if (!!item.valueRender) {
            opt.initialValue = item.valueRender(currentItem);
        }
        else if (!!currentItem) {

            opt.initialValue = !!item.render ? item.render(currentItem[item.dataIndex || item.code]) : currentItem[item.dataIndex || item.code];
        }
        if(!!item.onChange)
        {
            opt.getValueFromEvent=item.onChange
        }
        return opt;
    }

    handleMenuClick = (item, e) => {
        const { nameparameter = 'name', remove, menu, editAction } = this.props;

        switch (e.key) {
            case 'remove':
                {
                    Modal.confirm({
                        title: '删除',
                        content: <span>确定是否需要删除<span style={{ color: "red" }}>{item[nameparameter]}</span>？</span>,
                        okText: '确认',
                        cancelText: '取消',
                        onOk: () => {
                            if (!!remove) {
                                remove(item);
                            }
                        },
                    });
                    break;
                }
            case 'edit': {
                !!editAction ? editAction(item) : this.createModifyModal(true, item);
                break;
            }
            default:
                {
                    if (!!menu && Array.isArray(menu)) {
                        for (let i = 0; i < menu.length; i++) {
                            let itemNow = menu[i];
                            if (e.key === itemNow.primarykey) {
                                if (!!itemNow.action) {
                                    itemNow.action(item);
                                }
                            }
                        }
                    }
                    break;
                }

        }
    };

    renderExtendMenu = (record) => {
        const { menu } = this.props;
        let extendMenu = [];
        if (!!menu && Array.isArray(menu)) {

            menu.forEach(item => {
                let disabled = false;
                if (!!item.disabledAction) {
                    disabled = item.disabledAction(record);
                }
                extendMenu.push(<Menu.Item key={item.primarykey} disabled={disabled}>{item.name}</Menu.Item>);
            });
        }
        return extendMenu;
    }

    renderTitleMenu = (record) => {
        const { menuHeader } = this.props;
        let renderDom = [];
        if (!!menuHeader && Array.isArray(menuHeader)) {
            menuHeader.forEach(item => {
                renderDom.push(<Fragment><Divider type="vertical" /><a onClick={() => item.action(record)}>{item.title}</a> </Fragment>)
            })
        }
        return renderDom;
    }

    renderOperatorClumn = (columns) => {

        const { modifycolumn, remove, menu, detailName = '详情' } = this.props;
        if (!!columns && Array.isArray(columns)) {
            let returnColumn = [];
            columns.forEach(item => {
                returnColumn.push(item);
            })
            returnColumn.push({
                title: '操作',
                render: (text, record) => (
                    <Fragment>
                        <a onClick={() => this.createDetailModal(true, record)}>{detailName}</a>
                        {
                            this.renderTitleMenu(record)
                        }
                        {
                            !!modifycolumn || !!remove || !!menu ?
                                <Fragment>
                                    <Divider type="vertical" />
                                    <Dropdown overlay={
                                        <Menu onClick={this.handleMenuClick.bind(this, record)}>
                                            {!!modifycolumn ? <Menu.Item key="edit"><a>修改</a></Menu.Item> : void (0)}
                                            {!!remove ? <Menu.Item key="remove"><a>删除</a></Menu.Item> : void (0)}
                                            {this.renderExtendMenu(record)}
                                        </Menu>
                                    }>
                                        <a>
                                            更多 <Icon type="down" />
                                        </a>
                                    </Dropdown></Fragment> : void (0)
                        }

                    </Fragment>
                ),
            }
            )
            return returnColumn;
        }
        return [];
    }

    createRuleForFormItem = (item) => {
        let rules = [];
        if (!!item.required && item.required) {
            rules.push({ required: true, message: '该字段不能为空！' });
        }
        if (!!item.length) {
            rules.push(getFormNameLength(item.length));
        }
        if (!!item.pattern) {
            rules.push(getFormNameByPattern(item.pattern));
        }
        if (!!item.email && item.email) {
            rules.push({ type: 'email', message: '邮箱格式不正确' });
        }
        return rules;
    }


    createModifyData = Form.create()(props => {
        const { form, modifycolumn, modify, modsize = 720 } = props;
        const { currentItem } = this.state;
        const _this = this;
        const modifyFunction = () => {
            form.validateFields((err, fieldsValue) => {
                if (err) return;
                if (!!modify) {
                    _this.setState({updateButton:true})
                    modify(fieldsValue, this.state.currentItem, function (response) {
                        checkDataResultWithNotification(response).then(function () {
                            _this.setState({updateButton:false})
                            _this.createModifyModal(false, {});
                        }).catch(function(){
                            _this.setState({updateButton:false})
                        })

                    });
                }
            });
        }
        let newDom = [];
        if (Array.isArray(modifycolumn)) {
            modifycolumn.forEach(item => {
                let formItem = this.buildFormItem(form, item, currentItem);
                if (!!formItem) {
                    newDom.push(formItem);
                }
            })
        }
        
    const renderModifyFooterManager = () => {

        return [
            <Button loading={this.state.updateButton} key="cancel" onClick={() => this.createModifyModal(false, {})}>
                关闭
            </Button>,
            <Button key="forward" loading={this.state.updateButton} type="primary" onClick={() =>modifyFunction()}>
                提交
            </Button>,
        ];
    };
        return (<Modal
            destroyOnClose
            title="修改"
            width={modsize}
            visible={this.state.modifyVisible}

            footer={renderModifyFooterManager()}
            onCancel={() => this.createModifyModal(false,{})}
            maskClosable={false}
            okText='提交'
            cancelText='关闭'
        >
            <Form>
            {this.buildRolColForm(newDom)}
            </Form>

        </Modal>)
    })

    createDetailModal = (flag = false, current) => {
        const { detailAction } = this.props;
        if (!!detailAction) {
            detailAction(current);
        }
        else {
            this.setState({ detailVisible: flag, currentItem: current });
        }

    }

    addVisible = (flag = false) => {
        const { addAction } = this.props;
        if (!!addAction) {
            addAction();
        }
        else {
            this.setState({ createVisible: flag })
        }

    }

    createModifyModal = (flag = false, current) => {
        const { beforeUpdate } = this.props;
        if (!!beforeUpdate) {
            let a = beforeUpdate(current);
            if (!!a && a) {
                this.forceUpdate();
            }

        }
        this.setState({ modifyVisible: flag, currentItem: current })
    }

    searchForm = Form.create()(props => {
        const { form, querycolumn, search } = props;
        let newDom = [];
        const submitSearch = () => {
            form.validateFields((err, fieldsValue) => {
                if (err) return;
                if (!!search) {
                    search(fieldsValue);
                }
            });
        }
        const resetSearch = () => {
            form.resetFields();
        }
        if (Array.isArray(querycolumn)) {
            querycolumn.forEach(item => {
                newDom.push(
                    <Fragment>
                        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label={item.title}>
                            {form.getFieldDecorator(item.dataIndex)(this.renderFormItemTheme(item))}

                        </FormItem>
                    </Fragment>
                )
            })
        }
        newDom.push(
            <FormItem>
                <Divider type="vertical" />
                <Button onClick={() => submitSearch()}>查询</Button>
                <Divider type="vertical" />
                <Button onClick={() => resetSearch()}>重置</Button>
            </FormItem>
        )

        return (
            <Form layout="inline" >
           {newDom}
            </Form>
        );

    })

    buildRolColForm = (domArray) => {
        const { formRowNum = 1 } = this.props;
        let rowArray = [];
        if (!!domArray && Array.isArray(domArray)) {
            for (let i = 0; i < domArray.length; i = i + formRowNum) {

                let rowInForm = [];
                for (let k = 0; k < formRowNum; k++) {

                    if (!!domArray[i + k]) {
                        rowInForm.push(domArray[i + k]);
                    }
                }
                let rowFinish = this.buildColInform(rowInForm);
                let rowDom = <Row gutter={16}>
                    {rowFinish}
                </Row>;
                rowArray.push(rowDom)
            }



        }
        return rowArray;
    }

    buildColInform = (colArray) => {
        const { formRowNum = 1 } = this.props;
        let returColArray = [];
        let rowSpan = 24/ formRowNum;
        if (!!colArray && Array.isArray(colArray)) {
            for (let j = 0; j < colArray.length; j++) {

                let d = <Col span={rowSpan} >
                    {colArray[j]}
                </Col>
                returColArray.push(d);
              
            }
        }
        return returColArray;
    }

    renderHeadButton = () => {
        const { headerButton = [] } = this.props;
        let returnDom = [];
        if (!!headerButton && Array.isArray(headerButton)) {

            headerButton.forEach(item => {
                if (!!item.render) {
                    returnDom.push(item.render())
                }
            })
        }
        return returnDom;
    }


    render() {
        const { data, columns, totalnum, currentPage, addcolumn, add, modsize,addsize ,
            onPageChange, querycolumn, search, modifycolumn, modify, nopage = false, keyParameter } = this.props;
        let newcolumns = this.renderOperatorClumn(columns);
        return (
            <Fragment>
                <div>
                    {!!querycolumn ? <this.searchForm querycolumn={querycolumn} search={search} /> : void (0)}
                </div>
                <div style={{ marginTop: '20px' }}>
                    {
                        !!addcolumn ? <Button style={{marginBottom:20}} icon="plus" type="primary" onClick={() => this.addVisible(true)}>
                            新建
                 </Button> : void (0)
                    }
                    {this.renderHeadButton()}
                </div>
                <CustStandardTable
                    propKey={keyParameter}
                    data={data}
                    columns={newcolumns}
                    totalnum={totalnum}
                    currentPage={currentPage}
                    onPageChange={onPageChange}
                    nopage={nopage}
                />
                < this.createNewDataForm addcolumn={addcolumn} addsize={addsize} />
                {this.createDetailData()}
                < this.createModifyData modifycolumn={modifycolumn} modify={modify} modsize={modsize} />
            </Fragment >
        )
    }
}

export default SingleTable;