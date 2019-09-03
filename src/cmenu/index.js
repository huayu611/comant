import React, { PureComponent } from 'react';
import { Menu, Icon } from 'antd';
import PropTypes from 'prop-types';
import store from '../redux/store';
export default class NavigationMenu extends PureComponent {

    static propTypes = {
        dataSource: PropTypes.array,
        className: PropTypes.string,
        menuStyle: PropTypes.string,
        menuItemStyle: PropTypes.string,
        keyProp: PropTypes.string,
        iconProp: PropTypes.string,
        nameProp: PropTypes.string,
        urlProp: PropTypes.string,
        onClick: PropTypes.func,
    };

    componentDidMount() {
        this.unsubscribe = store.subscribe(() =>
            this.forceUpdate()
        );
    }


    static defaultProps = {
        dataSource: [],
        keyProp: 'webMenuCode',
        nameProp: 'webMenuName',
        urlProp: 'urlName',
        onClick: () => { },
    };

    renderTitle = (icon,name) => {

        return !!icon?<span>
            <Icon type={icon} />
            <span>{name}</span>
        </span>: <span>{name}</span>;
    }
    renderTreeNode = data => {
        if (!data) {
            return [];
        }
        const { menuItemStyle, keyProp, nameProp, urlProp,iconProp } = this.props;
 
        let childTree = data.children
        let sonTreeNode = [];
        if (!!childTree) {
            childTree.forEach(element => {
                sonTreeNode.push(this.renderTreeNode(element));
            });
        }
        if (!!data.children) {
            return [
                <Menu.SubMenu key={data[keyProp]} title={this.renderTitle(data[iconProp],data[nameProp])} >
                    {sonTreeNode}
                </Menu.SubMenu>
            ]
        }
        else {
     
            return [
                <Menu.Item
                    key={data[keyProp]}
                    style={menuItemStyle}
                    onClick={() => this.clickMenu(data)}
                    title={data[nameProp]} 
                    value={data[keyProp]}
                    key={data[keyProp]}
                    code={data[keyProp]}>
                    {data[nameProp]}
                </Menu.Item>
            ];
        }
    }

    renderTree = data => {
        if (!data) {
            return [];
        }
        let allSelectNode = [];
        data.forEach(element => {
            let node = this.renderTreeNode(element);
            allSelectNode.push(node);
        });

        return allSelectNode;
    }

    clickMenu = (data) => {
        const { onClick } = this.props;
        if (onClick) {
            onClick(data);
        }
    }

    renderMenu = () => {

        const { menuStyle, dataSource } = this.props;
        const { CURRENT_MENU } = store.getState();
        // let openParent = [];
        // let openMenu = [];
        // if(!!CURRENT_MENU && !!CURRENT_MENU.data && !!CURRENT_MENU.data.parentMenu && !!CURRENT_MENU.data.code)
        // {
        //     openParent.push(CURRENT_MENU.data.parentMenu) ;
        //     openMenu.push( CURRENT_MENU.data.code);
        // }
        // console.log(openMenu)
        // console.log(openParent)
        return (
            <Menu
                onClick={this.handleClick}
                mode="inline"
                theme="dark"
                style={menuStyle} >
                
                {this.renderTree(dataSource)}
            </Menu>
        )
    }

    render() {

        return (
            this.renderMenu()
        );
    }
}