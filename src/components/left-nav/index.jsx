import React, { Component } from 'react'
import { Link, withRouter } from "react-router-dom";
import Img from '../../assets/images/bg.png'
import menuList from '../../config/menuConfig';
import './index.less';
import { Menu, Icon } from 'antd';
import {connect} from 'react-redux'
import {
  AppstoreOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  MailOutlined,
  HomeOutlined
} from '@ant-design/icons';
import memoryUtils from '../../utils/memoryUtils'
import {setHeadTitle} from '../../redux/action'
const { SubMenu } = Menu


class LeftNav extends Component {

    /* 
    判断当前登录用户对item是否有权限
    */
    hasAuth = (item) => {
        const {key,isPublic} = item
        const menus = memoryUtils.user.role.menus
        const username = memoryUtils.user.username
        /* 
        1.如果当前用户是admin
        2.如果当前item是公开的
        3.当前用户有此item的权限：key有没有menus中
        */
       if (username==='admin' || isPublic || menus.indexOf(key)!==-1) {
           return true
       } else if (item.children) { //4.如果当前用户有此item的某个子item的权限
            return !!item.children.find(child => menus.indexOf(child.key)!==-1)
       }

       return false
    }

    /* 
    根据menu的数据数组生成对应的标签数组
    map + 递归
    */

/*     getMenuNodes_map = (menuList) => {
        return menuList.map(item => {
            if(!item.children) {
                return (
                    <Menu.Item key={item.key} icon={<HomeOutlined />}>
                        <Link to={item.key}>{item.title}</Link>
                    </Menu.Item>
                )
            } else {
                return (
                    <SubMenu key={item.key} icon={<MailOutlined />} title={item.title}>
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }
        })
    } */

    getMenuNodes = (menuList) => {

        //得到当前请求的路由路径
        let path = this.props.location.pathname

        // if(path.indexOf('/product')===0){
        //     path = '/product'
        // }

        return menuList.reduce((pre, item) => {

            // 如果当前用户有item对应的权限，才需要显示对应的菜单
            if(this.hasAuth(item)){
                // 向pre中添加<Menu.Item>
                if(!item.children) {
                    // 判断item是否是当前对应的item
                    if (item.key===path || path.indexOf(item.key)===0) {
                        this.props.setHeadTitle(item.title);
                    }

                    pre.push((
                        <Menu.Item key={item.key} icon={<HomeOutlined />}>
                            <Link to={item.key}
                            onClick={() => {this.props.setHeadTitle(item.title)}}
                            >{item.title}</Link>
                        </Menu.Item>
                    ))
                } else {

                    const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                    // 如果存在，说明当前item的子列表需要打开
                    if(cItem){
                        this.openKey = item.key
                    }
                    

                    // 向pre添加<SubMenu>
                    pre.push((
                        <SubMenu key={item.key} icon={<MailOutlined />} title={item.title}>
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    ))
                }
            }

            return pre
        },[])
    }

    componentWillMount(){
        this.menuNodes = this.getMenuNodes(menuList)
    }

    render() {

        //得到当前请求的路由路径
        let path = this.props.location.pathname

        if(path.indexOf('/product')===0){
            path = '/product'
        }
        
        // 得到需要打开菜单项的key
        const openKey = this.openKey
        return (
            <div className="left-nav">
                <Link to='/' className="left-nav-header">
                    <img src={Img} alt=""/>
                    <h1>酒馆后台</h1>
                </Link>
                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"
                    // inlineCollapsed={this.state.collapsed}
                    >
                    {/* <Menu.Item key="/home" icon={<PieChartOutlined />}>
                        <Link to="/home">首页</Link>
                    </Menu.Item>
                    <SubMenu key="sub1" icon={<MailOutlined />} title="商品">
                        <Menu.Item key="/category">
                            <Link to="/category">品类管理</Link>
                        </Menu.Item>
                        <Menu.Item key="/product">
                            <Link to="/product">商品管理</Link>
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item key="/user" icon={<PieChartOutlined />}>
                        <Link to="/user">用户管理</Link>
                    </Menu.Item>
                    <Menu.Item key="/role" icon={<PieChartOutlined />}>
                        <Link to="/role">角色管理</Link>
                    </Menu.Item> */}
                    {
                        this.menuNodes
                    }
                </Menu>
            </div>
                

        )
    }
}

/* 
withRouter高阶组件：
包装非路由组件，返回一个新的组件
新的组件向非路由组件传递3个属性：history/location/match
*/
export default connect(
    state => ({}),
    {setHeadTitle}
)(withRouter(LeftNav))