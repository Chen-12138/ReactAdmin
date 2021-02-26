import React, { Component } from 'react'
import PropTypes from "prop-types";
import {
    Form,
    Select,
    Input,
} from 'antd'

const Item = Form.Item
const Option = Select.Option

export default class UpdateForm extends Component {

    formRef = React.createRef();

    static propTypes = {
        categoryName: PropTypes.string,
        setForm:PropTypes.func
    }

    componentDidMount() {
        const form = this.formRef.current
        this.props.setForm(form)
    }

    render() {

        const {categoryName} = this.props

        return (
            <Form
                ref={this.formRef}
                layout='vertical'
            >
                <Item
                name="categoryName"
                label="分类名称"
                rules={[
                    {
                        required:true,
                        message:'请输入分类名称'
                    }
                ]}
                >
                    <Input placeholder='请输入分类名称'/>
                </Item>
            </Form>
        )
    }
}
