import React, { Component } from 'react'
import {
    Card,
    Button,
    Table,
    Modal,
    message
} from 'antd'
import {PAGE_SIZE} from '../../utils/constants'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { formateDate } from '../../utils/dateUtils'
import {reqRoles, reqAddRole, reqUpdateRole} from '../../api/index'
import AddForm from './add-form'
import AuthForm from './auth-form'
/* 
角色路由
*/
export default class Role extends Component {

    state = {
        roles: [],
        role: {},
        isShowAdd: false,
        isShowAuth: false
    }

    constructor(props){
        super(props)

        this.auth = React.createRef()
    }

    initColumn = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => formateDate(create_time)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            }
        ]
    }

    getRoles = async () => {
        const res = await reqRoles()
        if (res.status===0) {
            const roles = res.data
            this.setState({
                roles
            })
        }
    }

    onRow = (role) => {
        return {
            onClick: event => {
                this.setState({
                    role
                })
            }, // 点击行
            onDoubleClick: event => {},
            onContextMenu: event => {},
            onMouseEnter: event => {}, // 鼠标移入行
            onMouseLeave: event => {},
        };
    }

    /* 
    添加角色
    */
    addRole = async () => {

        try{
            const values = await this.form.validateFields()
            // 隐藏确认框
            this.setState({
                isShowAdd:false
            })

            // 收集输入数据
            const {roleName} = values
            this.form.resetFields()
            // 请求添加
            const res = await reqAddRole(roleName)
            if (res.status===0) {
                // 根据结果更新列表
                message.success('添加角色成功')
                this.getRoles()
                // 新产生的角色
                const role = res.data
                // 更新roles状态
                // const roles = this.state.roles
                // roles = [...roles,role]
                this.setState(state => ({
                    roles: [...state.roles,role]
                }))
            } else {
                message.error('添加角色失败')
            }
        } catch (error) {

        }
   
    }

    /* 更新角色 */
    updateRole = async () => {

        // 隐藏确认框
        this.setState({
            isShowAuth:false
        })

        const role = this.state.role
        // 得到最新的menus
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = memoryUtils.user.username

        // 请求更新
        const res = await reqUpdateRole(role)
        if (res.status===0) {
            
            // 如果当前更新的是自己角色的权限，强制退出
            if(role._id === memoryUtils.user.role_id){
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
                message.success('当前用户角色权限修改了，请重新登录')
            } else {
                message.success('设置角色权限成功')
                this.setState({
                    roles: [...this.state.roles]
                })
            }
            
        }
    }

    handleCancel = () => {
        this.setState({
            isShowAdd:false
        })
        this.form.resetFields()
    }

    componentWillMount(){
        this.initColumn()
    }

    componentDidMount(){
        this.getRoles()
    }

    render() {
        const {roles,role,isShowAdd,isShowAuth} = this.state

        const title = (
            <span>
                <Button type="primary" onClick={() => this.setState({isShowAdd:true})}>创建角色</Button> &nbsp; &nbsp;
                <Button type="primary" onClick={() => this.setState({isShowAuth:true})} disabled={!role._id}>设置角色权限</Button>
            </span>
        )

        return (

            <Card title={title}>
                <Table
                bordered
                rowKey="_id"
                dataSource={roles} 
                columns={this.columns} 
                pagination={{defaultPageSize:PAGE_SIZE}}
                rowSelection={{
                    type:'radio',
                    selectedRowKeys:[role._id],
                    onSelect: (role) => {
                        this.setState({
                            role
                        })
                    }
                }}
                onRow={this.onRow}
                ></Table>

                <Modal title="添加角色" 
                visible={isShowAdd} 
                onOk={this.addRole} 
                onCancel={this.handleCancel}>
                    <AddForm 
                    setForm={(form) => {this.form = form}}
                    />  
                </Modal>

                <Modal title="设置角色权限" 
                visible={isShowAuth} 
                onOk={this.updateRole} 
                onCancel={() => {
                    this.setState({isShowAuth:false})
                }}>
                    <AuthForm ref={this.auth} role={role}/>  
                </Modal>
            </Card>
        )
    }
}
