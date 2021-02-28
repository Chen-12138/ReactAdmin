import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Select,
    Input,
    Modal
} from 'antd'

const Item = Form.Item
const Option = Select.Option

export default class UserForm extends Component {

    formRef = React.createRef();

    static propTypes = {
        setForm: PropTypes.func
    }

    componentDidMount() {
        const form = this.formRef.current
        this.props.setForm(form)
    }

    render() {
        
        const {roles} = this.props
        const user = this.props.user || {}
        const {username,password,phone,email,role_id} = user
        return (
            <Form
                ref={this.formRef}
                layout="vertical"
                initialValues={{
                    username,
                    password,
                    phone,
                    email,
                    role_id
                }}
            >
                <Item
                label="用户名"
                name='username'
                rules={[
                    {
                        required:true,
                        message:'请输入角色名称'
                    }
                ]}
                >
                    <Input placeholder='请输入用户名'/>
                </Item>
                {
                    user._id ? null : <Item
                    label="密码"
                    name='password'
                    rules={[
                        {
                            required:true,
                            message:'请输入密码'
                        }
                    ]}
                    >
                        <Input text='password' placeholder='请输入密码'/>
                    </Item>
                }
                <Item
                label="手机号"
                name='phone'
                rules={[
                    {
                        required:true,
                        message:'请输入手机号'
                    }
                ]}
                >
                    <Input placeholder='请输入手机号'/>
                </Item>
                <Item
                label="邮箱"
                name='email'
                rules={[
                    {
                        required:true,
                        message:'请输入邮箱'
                    }
                ]}
                >
                    <Input placeholder='请输入邮箱'/>
                </Item>
                <Item
                label="角色"
                name='role_id'
                rules={[
                    {
                        required:true,
                        message:'请选择角色'
                    }
                ]}
                >
                    <Select placeholder="请选择角色">
                        {
                            roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                        }
                    </Select>
                </Item>
            </Form>
        )
    }
}
