import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Select,
    Input,
} from 'antd'

const Item = Form.Item
const Option = Select.Option

export default class AddForm extends Component {

    formRef = React.createRef();

    static propTypes = {
        categorys: PropTypes.array,
        parentId: PropTypes.string,
        setForm: PropTypes.func
    }

    componentDidMount() {
        const form = this.formRef.current
        this.props.setForm(form)
    }

    render() {

        const {categorys, parentId} = this.props

        return (
            <Form
                ref={this.formRef}
                layout='vertical'
                initialValues={{
                    parentId
                }}
            >
                <Item label="所属分类" name="parentId">
                    <Select>
                        <Option value='0'>一级分类</Option>
                        {
                            categorys.map(c => <Option value={c._id} key={c._id}>{c.name}</Option>)
                        }
                    </Select>
                </Item>

                <Item
                label="分类名称"
                name='categoryName'
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
