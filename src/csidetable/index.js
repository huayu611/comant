import { PureComponent, Fragment } from "react";
import { Button, Modal, Form, Input, Dropdown, Menu, Icon, Descriptions, DatePicker, InputNumber, Table } from 'antd';
import { getFormNameLength, getFormNameByPattern, checkDataResultWithNotification, getUploadInfo } from '../utils';
import SelectTree from '../cselecttree';
import SelectItem from '../cselectitem';
import ImageUpload from '../cuploadimage'
import TextQuill from '../ctext';
import moment from 'moment';
const FormItem = Form.Item;
@Form.create()
class SideTable extends PureComponent {

    static defaultProps = {
        keyParameter: "code",
    };
    state = {
        createVisible: false,
        detailVisible: false,
        modifyVisible: false,
        currentItem: {}
    }

    addFunction = () => {
        const { add, form } = this.props;
        let _this = this;
        form.validateFields((err, fieldsValue) => {
            if (err) return;

            if (!!add) {
                add(fieldsValue, function (response) {
                    checkDataResultWithNotification(response).then(function () {
                        _this.addVisible(false);
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
            case 'datatime':
                {
                    return <DatePicker disabled={!!item.disabled && item.disabled} style={{ width: '100%' }} showTime placeholder="点击获取时间" />
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
        const { detailcolumn, columns, detailName = '详情' } = this.props;
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
            visible={this.state.detailVisible}
            onOk={() => this.createDetailModal(false, {})}
            onCancel={() => this.createDetailModal(false, {})}
            maskClosable={false}

        >
            <Descriptions key="key" style={{ marginBottom: 24 }} column={1} bordered>
                {description}
            </Descriptions>

        </Modal>)
    }

    createNewData = () => {
        const { form, addcolumn, addsize = 620 } = this.props;
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
            {newDom}

        </Modal>)
    }

    buildFormItem = (form, item, currentItem) => {
        let condition = item.condition;
        if (!!condition) {

            let key = condition.key;
            let value = condition.value;

            if (!!key && !!value) {
                if (form.getFieldValue(key) !== value) {
                    return null;
                }
            }
        }
        return (
            <FormItem labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label={item.title}>
                {form.getFieldDecorator(item.code, this.buildFormOption(item, currentItem))(this.renderFormItemTheme(item))

                }
            </FormItem>
        )
    }

    buildFormOption = (item, currentItem) => {
        let opt = {};
        opt.rules = this.createRuleForFormItem(item);
        if (!!currentItem) {
            opt.initialValue = !!item.render ? item.render(currentItem[item.dataIndex || item.code]) : currentItem[item.dataIndex || item.code];
        }
        return opt;
    }

    handleMenuClick = (item, e) => {
        const { nameparameter = 'name', remove, menu, editAction } = this.props;

        switch (e.key) {
            case 'detail': {
                this.createDetailModal(true, item);
                break;
            }
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

    renderOperatorClumn = (columns) => {
        const { view, num } = this.props;
        let returnColumn = [];
        if (!!num) {
            returnColumn.push({
                title: '序号',
                dataIndex: num,
            })
        }
        returnColumn.push({
            title: '键值',
            dataIndex: view,
        })
        returnColumn.push({
            title: '操作',
            render: (text, record) => (
                <Dropdown overlay={
                    <Menu onClick={this.handleMenuClick.bind(this, record)}>
                        <Menu.Item key="detail"><a>详情</a></Menu.Item>
                        <Menu.Item key="edit"><a>修改</a></Menu.Item>
                        <Menu.Item key="remove"><a>删除</a></Menu.Item>
                    </Menu>
                }>
                    <a>
                        <Icon type="down" />
                    </a>
                </Dropdown>
            ),
        }
        )
        return returnColumn;
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
                    modify(fieldsValue, this.state.currentItem, function (response) {
                        checkDataResultWithNotification(response).then(function () {
                            _this.createModifyModal(false, {});
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
        return (<Modal
            destroyOnClose
            title="修改"
            width={modsize}
            visible={this.state.modifyVisible}
            onOk={modifyFunction}
            onCancel={() => this.createModifyModal(false, {})}
            maskClosable={false}
            okText='提交'
            cancelText='关闭'
        >
            <Form>
                {newDom}
            </Form>

        </Modal>)
    })

    createDetailModal = (flag = false, current) => {
        this.setState({ detailVisible: flag, currentItem: current });
    }

    addVisible = (flag = false) => {
        this.setState({ createVisible: flag })
    }

    createModifyModal = (flag = false, current) => {
        this.setState({ modifyVisible: flag, currentItem: current })
    }
    onRow = (record, index) => {
        const { onRowClick } = this.props;
        if (!!onRowClick) {
            onRowClick(record, index);
        }
    }
    render() {
        const { data, column, addcolumn, add, modifycolumn, modify, keyParameter } = this.props;
        let newcolumns = this.renderOperatorClumn(column);
        return (
            <Fragment>
                <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                    <Button icon="plus" onClick={() => this.addVisible(true)}>
                        添加
                 </Button>
                </div>
                <Table dataSource={data} size="small" columns={newcolumns} pagination={false} showHeader={false}
                    rowClassName="sidetable"
                    onRow={(record, index) => {
                        return {
                            onClick: event => this.onRow(record, index),
                        };
                    }}
                />
                {this.createNewData()}
                {this.createDetailData()}
                < this.createModifyData modifycolumn={modifycolumn} modify={modify} />
            </Fragment >
        )
    }
}
export default SideTable;