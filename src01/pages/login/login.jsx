import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './login.less'
import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils';

/* 登录的路由组件 */
export default class Login extends Component {
    // 通过ref获取表单
    formRef = React.createRef();
    
    handleSubmit = async (event) => {
        // 得到form对象
        const form = this.formRef.current
        // 获取表单项的输入数据
        const values = form.getFieldsValue()
        const {username, password} = values
        const result = await reqLogin(username, password)
        if(result.status===0) {
            message.success('登录成功')

            // 保存user
            const user = result.data
            memoryUtils.user = user //保存在内存中
            storageUtils.saveUser(user) //保存到local

            // 跳转到管理界面(不需要回退)
            this.props.history.replace('/')

        } else {
            message.error(result.msg)
        }
    }

    /* 
        对密码进行自定义验证
    */

    //    callback('xxx') //验证失败，并指定提示文本

    render() {

        // 如果用户已经登录，自动跳转到管理界面
        const user = memoryUtils.user
        if(user && user._id) {
            return <Redirect to='/'/>
        }

        return (
            <div className="login">
                <header className="login-header">
                    <div className="title">聆听酒馆</div>、
                    <h1>React后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <Form
                        ref={this.formRef}
                        name="normal_login"
                        className="login-form"
                        onFinish={this.handleSubmit}
                        // onFinish={this.handleSubmit}
                        initialValues={{
                            remember: true,
                        }}
                        
                        >
                        <Form.Item
                            name="username"
                            rules={[
                            {
                                required: true,
                                message: 'Please input your Username!',
                            },
                            {
                                min:4,
                                message: '用户名不能少于4位'
                            },
                            {
                                max:12,
                                message: '用户名不能多于12位'
                            },
                            {
                                pattern:/^[a-zA-Z0-9_]+$/,
                                message: '用户名必须是由英文、数字或下划线组成'
                            }
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    validator:async (_,value) => {
                                        if(!value) {
                                                return Promise.reject('密码必须输入')
                                            } else if (value.length<4){
                                                return Promise.reject('密码长度不能小于4位')
                                            } else if (value.length>12) {
                                                return Promise.reject('密码长度不能大于12位')
                                            } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
                                                return Promise.reject('密码必须是由英文、数字或下划线组成')
                                            } else {
                                                return Promise.resolve() //验证通过
                                            }
                                        
                                    }
                                }
                            ]}
                        >
                            <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}
