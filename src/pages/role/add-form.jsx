import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Select,
    Input,
    Modal
} from 'antd'

const Item = Form.Item

export default class AddForm extends Component {

    formRef = React.createRef();

    static propTypes = {
        setForm: PropTypes.func
    }

    componentDidMount() {
        const form = this.formRef.current
        this.props.setForm(form)
    }

    render() {
        
        return (
            <Form
                ref={this.formRef}
                layout='vertical'
                initialValues={{
                    
                }}
            >
                <Item
                label="角色名称"
                name='roleName'
                rules={[
                    {
                        required:true,
                        message:'请输入角色名称'
                    }
                ]}
                >
                    <Input placeholder='请输入角色名称'/>
                </Item>
            </Form>
        )
    }
}
