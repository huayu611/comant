import React, { Component, PureComponent, Fragment } from 'react';
import { Menu, Item, Separator, Submenu, MenuProvider } from 'react-contexify';
import { Tree, Icon, Modal, Dropdown, Form, Button, Input } from 'antd';
import { checkDataResultWithNotification } from "../utils"
import SelectTree from '../cselecttree';
import 'react-contexify/dist/ReactContexify.min.css';
import ImageUpload from '../cuploadimage'
import { getUploadInfo } from '../utils';
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;

@Form.create()
class DetailModal extends PureComponent {
    static defaultProps = {
        handleUpdate: () => { },
        handleUpdateModalVisible: () => { },
        values: {},
    };

    constructor(props) {
        super(props);

        this.state = {
            formVals: {
                code: props.current.code,
                name: props.current.name,
            },
        };

        this.formLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 13 },
        };
    }

    handleNext = () => {
        const { form, handleUpdate, catalogs, current, addFlag, pcode } = this.props;
        const { formVals: oldValue } = this.state;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const formVals = { ...oldValue, ...fieldsValue };
            this.setState(
                {
                    formVals,
                },
                () => {
                    handleUpdate(current[pcode], formVals.name, formVals.parent, addFlag);
                }
            );
        });
    };

    renderContent = formVals => {
        const { form, current, addFlag, catalogs, pname, pcode, pparent } = this.props;
        let currentName = current[pname];
        let dis = true;
        if (addFlag) {
            currentName = "";
            dis = false;
        }
        let defaultMenu = addFlag ? current[pcode] : current[pparent];
        return [

            <React.Fragment>
                <FormItem key="parent" {...this.formLayout} label="上级目录">
                    {form.getFieldDecorator('parent', {
                        initialValue: defaultMenu,
                    })(<SelectTree code={pcode} name={pname} values={catalogs} value={defaultMenu} disable={dis} />)}
                </FormItem>

                {
                    this.props.image && <FormItem key="parent" {...this.formLayout} label="目录图片">
                        {form.getFieldDecorator('image', {
                            initialValue: defaultMenu,
                        })( <ImageUpload uploadProp={getUploadInfo(this.props.image)} />)}
                    </FormItem>
                }
                <FormItem key="name" {...this.formLayout} label="目录名称">
                    {form.getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入目录名称！' }],
                        initialValue: currentName,
                    })(<Input placeholder="请输入" />)}
                </FormItem>
            </React.Fragment>


        ];
    };
    renderFooter = () => {
        const { handleUpdateModalVisible } = this.props;
        return [
            <Button key="cancel" onClick={() => handleUpdateModalVisible(false)}>
                取消
        </Button>,
            <Button key="forward" type="primary" onClick={() => this.handleNext()}>
                完成
        </Button>,
        ];

    };
    render() {
        const { updateModalVisible, handleUpdateModalVisible } = this.props;
        const { formVals } = this.state;

        return (
            <Modal
                width={640}
                bodyStyle={{ padding: '32px 40px 48px' }}
                destroyOnClose
                title="目录信息修改"
                visible={updateModalVisible}
                footer={this.renderFooter()}
                onCancel={() => handleUpdateModalVisible(false)}
                afterClose={() => handleUpdateModalVisible(false)}
            >
                {this.renderContent(formVals)}
            </Modal>
        );
    }
}



class SideTree extends PureComponent {

    static defaultProps = {
        pname: 'name',
        pcode: 'code',
        pparent: 'parent',
        image: undefined

    }
    constructor(props) {
        super(props);
        this.state = {
            allCatalog: {
                value: []
            },
            visibleUpdate: false,
            currentItem: {},
            addFlag: false,
        };
    }
    clickTree = (va, selected) => {
        const { onSelectTree } = this.props;
        if (!!onSelectTree) {
            onSelectTree(selected.props);
        }
    }

    handleUpdate = (code, name, parent) => {
        const { update, add } = this.props;
        const { addFlag } = this.state;
        const _this = this;
        let handleUpdateModalVisibleFunction = flag => this.handleUpdateModalVisible(flag);
        let queryAllCatalogTreeFunction = () => this.queryAllCatalogTree();
        //不能用promise
        if (addFlag) {
            let param = {
                name: name,
                parent: parent,
            }
            add(param, function (resp) {
                checkDataResultWithNotification(resp);
                handleUpdateModalVisibleFunction(false);
            })

        }
        else {
            let param = {
                code: code,
                name: name,
                parent: parent,
            }
            update(param, function (resp) {
                checkDataResultWithNotification(resp);
                handleUpdateModalVisibleFunction(false);

            });

        }
    };



    handleUpdateModalVisible = (flag, item) => {

        const { visibleUpdate } = this.state;
        flag = flag || false;
        if (!flag) {
            this.setState({ visibleUpdate: flag, currentItem: {} });
        }
        else {
            this.setState({ visibleUpdate: flag, currentItem: item, addFlag: false });
        }

    }

    handleAddModalVisible = (flag, item) => {
        const { visibleUpdate } = this.state;
        flag = flag || false;
        if (!flag) {
            this.setState({ visibleUpdate: flag, currentItem: {}, addFlag: flag });
        }
        else {
            this.setState({ visibleUpdate: flag, currentItem: item, addFlag: flag });
        }

    }

    updateTreeNode = (sonNode, targetNode) => {
        const { dispatch } = this.props;
        let newCatalogInfo = {
            parentMenuCode: targetNode,
            articleMenuCode: sonNode,
        }
        let queryAllCatalogTreeFunction = this.queryAllCatalogTree;
        const { update } = this.props;

        let param = {
            code: sonNode,
            parent: targetNode || '',
        }
        update(param, function (resp) {
            checkDataResultWithNotification(resp);
        });
    }



    renderTreeNode = data => {

        if (!data) {
            return [];
        }

        let catalogSonTree = data.children;
        let sonTreeNode = [];
        if (!!catalogSonTree && Array.isArray(catalogSonTree)) {

            catalogSonTree.forEach(element => {
                sonTreeNode.push(this.renderTreeNode(element));
            });

        }
        const { pname, pcode } = this.props;

        return [

            <TreeNode title={this.renderTitle(data)} name={data[pname]} key={data[pcode]} code={data[pcode]}>
                {sonTreeNode}
            </TreeNode>
        ];
    }

    moveToRootCatalog = item => {
        const { pname, pcode } = this.props;
        Modal.confirm({
            title: '移动目录',
            content: '确定是否将 [' + item[pname] + '] 移至根目录？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => { this.updateTreeNode(item[pcode], "") },
        });
    }

    removeCatalog = (item) => {

        const { dispatch, del, pcode, pname } = this.props;
        let param = {
            code: item[pcode]
        }
        Modal.confirm({
            title: '删除目录',
            content: '确定是否删除[' + item[pname] + ']？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                del(param, function (resp) {
                    checkDataResultWithNotification(resp);
                });
            },
        });



    }

    renderTitle = item => {
        const { pname, pcode } = this.props;
        const MyAwesomeMenu = () => (
            <Menu key={item[pcode]} id={item[pcode]}>
                <Item onClick={() => this.handleUpdateModalVisible(true, item)}>修改名称</Item>
                <Item onClick={() => this.handleAddModalVisible(true, item)}>添加子目录</Item>
                <Item onClick={() => this.moveToRootCatalog(item)}>移至根目录</Item>
                <Separator />
                <Item onClick={() => this.removeCatalog(item)}>删除目录</Item>
            </Menu>
        );
        const title = (
            <Fragment>
                <MenuProvider id={item[pcode]}>{item[pname]} </MenuProvider>
                <MyAwesomeMenu />
            </Fragment>
        );
        return title;
    }

    handleMenuClick = () => {

    }



    clickonDrop = (prop) => {

        let dragProps = prop.dragNode.props;
        let targetProps = prop.node.props;
        Modal.confirm({
            title: '移动目录树',
            content: '确定是否需要将 [' + dragProps.name + '] 移到到 [' + targetProps.name + '] ？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => this.updateTreeNode(dragProps.code, targetProps.code),
        });
    }

    renderTree = data => {
        let treeArray = [];
        if (data instanceof Array) {

            data.forEach(element => {
                treeArray.push(this.renderTreeNode(element))
            });
        }
        return treeArray;
    }
    render() {
        const updateMethod = {
            handleUpdate: this.handleUpdate,
            handleUpdateModalVisible: this.handleUpdateModalVisible,
        }
        const { visibleUpdate, currentItem, addFlag } = this.state;
        const { data } = this.props;
        return [
            <Fragment>
                <div style={{ textAlign: "center" }}>
                    <Button onClick={() => this.handleAddModalVisible(true, {})}>添加根目录</Button>
                </div>

                <Tree defaultExpandAll={true} draggable onClick={this.clickTree} key="ok"
                    onDrop={this.clickonDrop}>
                    {this.renderTree(data)}
                </Tree>
                <DetailModal {...updateMethod} {...this.props}
                    addFlag={addFlag}
                    current={currentItem}
                    updateModalVisible={visibleUpdate}
                    catalogs={data}
                    image={this.props.image}
                />
            </Fragment>
        ]
    }
}


export default SideTree;