import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Input,
    Tree
} from 'antd'

import menuList from '../../config/menuConfig'

const Item = Form.Item

const treeData = [
    {
        title: '权限管理',
        key: 'all',
        children:menuList
    }
]

export default class AuthForm extends Component {

    componentDidMount() {
        
    }

    // 根据新传入的role来更新checkedKeys状态
    componentWillReceiveProps(nextProps){
        const menus = nextProps.role.menus
        this.setState({
            checkedKeys:menus
        })
    }

    state = {
        checkedKeys: []
    }

    constructor(props){
        super(props)

        // 根据传入角色的menus生成初始状态
        const {menus} = this.props.role
        console.log(menus)
        this.state = {
            checkedKeys: menus
        }
    }

    /* 
    为父组件提交获取最新menus数据的方法
    */
    getMenus = () => {
        return this.state.checkedKeys
    }

    onCheck = (checkedKeys) => {
        this.setState({
            checkedKeys
        })
    }

    render() {
        const {role} = this.props
        const {checkedKeys} = this.state

        return (
            <Form
            initialValues={{
                name:role.name
            }}
            >
                <Item
                label="角色名称"
                name='roleName'
                >
                    <Input value={role.name} disabled/>
                </Item>
                
                <Tree
                checkable
                defaultExpandAll
                treeData={treeData}
                checkedKeys={checkedKeys}
                onCheck={this.onCheck}
                />
            </Form>
        )
    }
}
