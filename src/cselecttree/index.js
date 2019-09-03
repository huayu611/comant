import React, { Component, PureComponent } from 'react';
import { TreeSelect } from 'antd';
const TreeNode = TreeSelect.TreeNode;
class SelectTree extends PureComponent {
    constructor(props) {
        super(props);
    }
    static defaultProps = {
        code: "code",
        name: "name",
        disabled:false,
    };


    selectChange = (item, label) => {
        const { onChange, saveLabel } = this.props;
        onChange(item);
        if (!!saveLabel) {
            saveLabel(label);
        }
    };
    renderTreeNode = (data, disable) => {
        const { name, code } = this.props;
        if (!data) {
            return [];
        }
        const { current } = this.props;
        let disableTemp = disable;
        if (current === data[code]) {
            disableTemp = true;
        }
        let childTree = data.children
        let sonTreeNode = [];
        if (!!childTree) {
            childTree.forEach(element => {
                sonTreeNode.push(this.renderTreeNode(element, disableTemp));
            });
        }
        return [

            <TreeNode title={data[name]} value={data[code]} disabled={disableTemp} key={data[code]} code={data[code]}>
                {sonTreeNode}
            </TreeNode>
        ];
    }
    renderTree = (data) => {
        if (!data) {
            return [];
        }
        let allSelectNode = [];
        data.forEach(element => {
            let node = this.renderTreeNode(element, false);
            allSelectNode.push(node);
        });


        return allSelectNode;
    }
    render() {
        const { values, value, disable, current,disabled } = this.props;
        return [
            <TreeSelect
                showSearch
                style={{ width: 300 }}
                value={value}
                disabled={disabled}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="请选择"
                allowClear
                onChange={this.selectChange}
                disabled={disable}
            >
                {this.renderTree(values)}
            </TreeSelect>
        ]
    }
}

export default SelectTree;