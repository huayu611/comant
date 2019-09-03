import * as React from 'react';
export interface INavigationMenuProp {
    dataSource?: string[];
    style?: React.CSSProperties;
    className?: string;
    menuStyle?:React.CSSProperties;
    menuItemStyle?:React.CSSProperties;
    keyProp?:string;
    nameProp?:string;
    urlProp?:string;
    iconProp?:string;
    onClick?: (code:string,path: string) => void;
}

export default class NavigationMenu extends React.Component<INavigationMenuProp, any> {}