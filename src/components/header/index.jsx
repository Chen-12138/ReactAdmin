import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import menuList from '../../config/menuConfig'
import LinkButton from "../link-button";
import {formateDate} from "../../utils/dateUtils";
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {connect} from 'react-redux'
import { loginOut } from "../../redux/action";

import './index.less'

const { confirm } = Modal;

class Header extends Component {

    state = {
        currentTime: formateDate(Date.now()) //当前时间字符串
    }

    getTime = () => {
        // 每隔1s获取当前时间，并更新状态数据
        this.intervalId = setInterval(()=>{
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        },1000)
    }
    
    getTitle = () => {
        // 得到当前请求路径
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if(item.key===path){ //如果当前item对象与path一样
                title = item.title
            } else if (item.children) {
                // 在所有子item中查找匹配的
                const cItem = item.children.find(item => path.indexOf(item.key)===0)
                // 如果有值才说明有匹配的
                if(cItem){
                    title = cItem.title
                }
            }
        })
        return title
    }

    // 退出登录
    handleOut = () => {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: '确定退出吗？',
            onOk: () => {
            //   console.log('OK');
            // 删除保存的user数据
            storageUtils.removeUser()
            this.props.loginOut()
            // 跳转到login
            this.props.history.replace('/login')
            }
          });
    }

    /* 
    第一次render()之后执行一次
    一般在此执行异步操作：发ajax请求/启动定时器
    */
    componentDidMount(){
        // 获取当前时间
        this.getTime()
    }

    componentWillUnmount(){
        clearInterval(this.intervalId)
    }

    render() {

        const {currentTime} = this.state

        const username = this.props.user.username

        const title = this.props.headTitle

        // 得到当前需要显示的title
        // const title = this.getTitle()
        
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{username}</span>
                    <LinkButton onClick={this.handleOut}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src="" alt=""/>
                        <span>weather</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        headTitle: state.headTitle,
        user:state.user
    }),
    {loginOut}
)(withRouter(Header))