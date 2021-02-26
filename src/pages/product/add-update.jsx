import React, { Component } from 'react'
import {
    Card,
    Form,
    Input,
    Cascader,
    Upload,
    Button,
    message,
} from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
import LinkButton from '../../components/link-button'
import {reqAddOrUpdateProduct, reqCategorys} from '../../api'

const {TextArea} = Input

export default class ProductAddUpdate extends Component {

    state = {
        optionLists: []
    }
    
    formRef = React.createRef()

    constructor(props){
        super(props)

        // 创建用来保存ref标识的标签对象的容器
        this.pw = React.createRef()
        this.editor = React.createRef()
    }

    initOptions = async (categorys) => {
        // 根据categorys生成options数组
        const optionLists = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false
        }))

        // 如果是一个二级分类商品的更新
        const {isUpdate, product} = this
        const {pCategoryId, categoryId, imgs} = product
        if(isUpdate && pCategoryId!=='0'){
            // 获取对应的二级分类列表
            const subCategorys = await this.getCategorys(pCategoryId)
            // 生成二级下拉列表的options
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))

            // 找到当前商品对应的一级option对象
            const targetOption = optionLists.find(option => option.value===pCategoryId)

            // 关联到对应的以及option上
            targetOption.children = childOptions
        } 

        // 更新options状态
        this.setState({
            optionLists
        })
    }

    /* 
    获取一级/二级分类列表，并显示
    */
    getCategorys = async (parentId) => {
        const res = await reqCategorys(parentId)
        if (res.status===0) {
            const categorys = res.data
            if (parentId==='0') {
                this.initOptions(categorys)   
            } else {
                return categorys
            }
        }
    }
    

    submit = async () => {
        const form = this.formRef.current
        const values = form.getFieldsValue()
        const {name,desc,price,categoryIds} = values
        let pCategoryId, categoryId
        if (categoryIds.length===1) {
            pCategoryId = '0'
            categoryId = categoryIds[0]
        } else {
            pCategoryId = categoryIds[0]
            categoryId = categoryIds[1]
        }
        const imgs = this.pw.current.getImgs()
        const detail = this.editor.current.getDetail()

        const product = {name, desc, price, imgs, detail, pCategoryId, categoryId}

        // 如果是更新，需要添加_id
        if(this.isUpdate){
            product._id = this.product._id
        }

        console.log(product)

        // 调用接口请求函数
        const res = await reqAddOrUpdateProduct(product)
        
        // 根据结果提示
        if (res.status===0) {
            message.success(`${this.isUpdate ? '更新' : '添加'}商品成功`)
            this.props.history.goBack()
        } else {
            message.error(`${this.isUpdate ? '更新' : '添加'}商品失败`)
        }
    }

    componentDidMount(){
        this.getCategorys('0')
    }

    componentWillMount(){
        // 取出携带的state
        const product = this.props.location.state
        // 保存是否更新的标识
        this.isUpdate = !!product
        this.product = product || {}
    }

    render() {

        const {isUpdate,product} = this
        const {pCategoryId, categoryId, imgs, detail} = product
        // 用来接收级联分类ID的数组
        const categoryIds = []
        if(isUpdate) {
            // 商品是一个一级分类商品
            if (pCategoryId==='0') {
                categoryIds.push(pCategoryId)
            } else {
                // 商品是一个二级分类商品
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
                // console.log(categoryIds)
            }

        }

        const title = (
            <span>
                <LinkButton>
                    <ArrowLeftOutlined style={{marginRight:1,fontSize:17}}
                        onClick={()=>{this.props.history.goBack()}}
                    />
                    <span>{isUpdate ? '修改商品' : "添加商品"}</span>
                </LinkButton>
            </span>
        )
        
        const formItemLayout = {
            labelCol: {
                xs: {
                  span: 6,
                },
                sm: {
                  span: 2,
                },
              },
              wrapperCol: {
                xs: {
                  span: 12,
                },
                sm: {
                  span: 8,
                },
              },
        };

        const loadData = async selectedOptions => {
            // 得到选择的option对象
            const targetOption = selectedOptions[0];
            // 显示loadings
            targetOption.loading = true;
            
            // 根据选中的分类，请求获取二级分类列表
            const subCategorys = await this.getCategorys(targetOption.value)
            targetOption.loading = false;
            if (subCategorys && subCategorys.length > 0) {
                const childOptions = subCategorys.map(c => ({
                    value: c._id,
                    label: c.name,
                    isLeaf: true
                }))
                // 关联到当前options上
                targetOption.children = childOptions
            } else { //无二级分类
                targetOption.isLeaf = true
            }

            //   更新option状态
            this.setState({
                optionLists: this.state.optionLists
            })
        };


        return (
            <Card title={title}>
                <Form {...formItemLayout} 
                ref={this.formRef}
                onFinish={this.handleSubmit}
                initialValues={{
                    name:product.name,
                    desc:product.desc,
                    price:product.price,
                    categoryIds
                }}
                >
                    <Form.Item 
                    name="name"
                    label="商品名称："
                    style={{marginRight:20}}
                    rules={[
                        {
                            required:true,
                            message:'请输入商品名称'
                        }
                    ]}
                    >
                        <Input placeholder='请输入商品名称'></Input>
                    </Form.Item>
                    <Form.Item 
                    name="desc"
                    label="商品描述："
                    rules={[
                        {
                            required:true,
                            message:'请输入商品描述'
                        }
                    ]}
                    >
                        <TextArea placeholder="请输入商品描述" autosize={{minRows:2,maxRows:6}}></TextArea>
                    </Form.Item>
                    <Form.Item 
                    name="price"
                    label="商品价格："
                    rules={[
                        {
                            required:true,
                            message:'请输入商品价格'
                        },
                        {
                            validator:(_,value) => {
                                if (value<=0) {
                                    return Promise.reject('价格必须大于0')
                                } else {
                                    return Promise.resolve()
                                }
                            }
                        }
                    ]}
                    >
                        <Input type="number" placeholder="请输入商品价格" addonAfter='元'></Input>
                    </Form.Item>
                    <Form.Item 
                    name="categoryIds"
                    label="商品分类："
                    // initialValue={categoryIds}
                    rules={[
                        {
                            required:true,
                            message:'请选择商品分类'
                        }
                    ]}
                    >   
                        <Cascader 
                            options={this.state.optionLists} 
                            loadData={loadData} 
                            // onChange={onChange}
                            changeOnSelect 
                        />
                    </Form.Item>
                    <Form.Item label="商品图片：">
                        <PicturesWall ref={this.pw} a='1' imgs={imgs}/>
                    </Form.Item>
                    <Form.Item label="商品详情："
                    labelCol={{span:2}}
                    wrapperCol={{span:20}}
                    >
                        <RichTextEditor ref={this.editor} detail={detail}/>
                    </Form.Item>
                    <Form.Item>
                        <Button 
                        type='primary'
                        htmlType="submit"
                        onClick={this.submit}
                        >提交</Button>
                    </Form.Item>
                </Form>
            </Card>
        )
    }
}
