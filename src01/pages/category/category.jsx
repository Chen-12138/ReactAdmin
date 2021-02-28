import React, { Component } from 'react'
import {
    Card,
    Table,
    Button,
    Icon,
    message,
    Modal,
    Result
} from 'antd'

import { ArrowRightOutlined } from '@ant-design/icons'

import LinkButton from '../../components/link-button'
import { reqCategorys, reqUpdateCategory, reqAddCategory } from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'

export default class Category extends Component {

    state = {
        loading:false,
        categorys: [], //一级分类列表
        subCategorys:[], //子分类列表
        parentId: '0',  //当前需要显示的分类列表的父分类id
        parentName: '', //当前需要显示的分类列表的父分类名称
        showStatus: 0, //标识添加/更新的确认框是否显示 0都不显示 1表示添加 2表示更新
    }

    /* 
    初始化Table所有列的数组
    */
   initColumns = () => {
    this.columns = [
        {
          title: '分类的名称',
          dataIndex: 'name'
        },
        {
          title: '操作',
          width: 400,
          render: (category) => (
              <span>
                  <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                  {/* 如何向事件回调函数传递参数 */}
                  {this.state.parentId==='0'?<LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton> : null}
              </span>
          )
        }
      ];
   }

   /* 
   异步获取一级/二级分类列表显示
   */
    getCategorys = async (parentId) => {
    
        this.setState({loading:true})

        parentId = parentId || this.state.parentId

        const res = await reqCategorys(parentId)

        if(res.status===0){
            this.setState({loading:false})
            // 取出分类数组(可能是一级也可能是二级的)
            const categorys = res.data
            // 更新一级分类状态
            if(parentId==="0"){
                // 更新一级分类状态
                this.setState({
                    categorys
                })
            } else {
                // 更新二级分类状态
                this.setState({
                    subCategorys: categorys
                })
            }
        }else{
            message.error('获取分类列表失败')
        }
    }

    /* 显示指定一级分类对象的二级列表 */
    showSubCategorys = (category) => {
        // 更新状态
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, ()=>{ //在状态更新且重新render()后执行
            this.getCategorys()
        })
    }

    /* 显示指定一级分类列表 */
    showCategorys = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: []
        })
    }

    /* 响应点击取消：隐藏确认框 */
    handleCancel = () => {
        // 隐藏确认框
        this.setState({
            showStatus:0
        })
        this.form.resetFields()
    }

    /* 显示添加 */
    showAdd = () => {
        this.setState({showStatus:1})
    }

    /* 显示修改 */
    showUpdate = (category) => {
        this.category = category
        // 更新状态
        this.setState({showStatus:2})
    }

    /* 添加分类 */
    addCategory = async () => {

        try{
            const values = await this.form.validateFields();
            // 隐藏确认框
            this.setState({
                showStatus:0
            })

            // 收集数据，并提交添加分类的请求
            const { parentId, categoryName } = values

            const res = await reqAddCategory(parentId,categoryName)

            // 清除输入数据
            this.form.resetFields()

            if(res.status===0){
                // 添加的分类是当前分类列表下的分类
                if (parentId===this.state.parentId) {
                    // 重新获取分类列表显示
                    this.getCategorys()
                } else if (parentId==='0'){
                    this.getCategorys()
                }

            }
        } catch (error) {
            console.log(error)
        }

    }

    /* 更新分类 */
    updateCategory = async () => {

        try{
            const values = await this.form.validateFields();
            // 1.隐藏确定框
            this.setState({
                showStatus:0
            })

            // 准备数据
            const categoryId = this.category._id

            const {categoryName} = values

            // 清除输入数据
            this.form.resetFields()

            // 2.发请求更新分类
            const result = await reqUpdateCategory(categoryId,categoryName)
            if(result.status===0){
                // 3.重新显示列表
                this.getCategorys()
            }
        } catch(error) {
            console.log(error)
        }
    }

    componentWillMount(){
        this.initColumns()
    }

    componentDidMount(){
        this.getCategorys()
    }

    render() {

        // 读取状态数据
        const {categorys,subCategorys,parentId,parentName,loading,showStatus} = this.state
        // 读取指定的分类
        const category = this.category || {}

        // card的左侧标题
        const title = parentId === '0' ? "一级分类列表" : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <ArrowRightOutlined style={{marginRight:5}}/>
                <span>{parentName}</span>
            </span>
        )
        // card的右侧
        const extra = (
            <Button type="primary" onClick={this.showAdd}>
                添加
            </Button>
        )

        return (
            <Card title={title} extra={extra}>
                <Table
                bordered
                loading={loading}
                rowKey="_id"
                dataSource={parentId==='0' ? categorys : subCategorys} 
                columns={this.columns} 
                pagination={{defaultPageSize:5}}
                />

                <Modal title="添加分类" 
                visible={showStatus===1} 
                onOk={this.addCategory} 
                onCancel={this.handleCancel}>
                    <AddForm 
                    categorys={categorys} 
                    parentId={parentId}
                    setForm={(form) => {this.form = form}}
                    />
                </Modal>

                <Modal title="更新分类" 
                visible={showStatus===2} 
                onOk={this.updateCategory} 
                onCancel={this.handleCancel}
                >
                    <UpdateForm
                    categoryName={category.name}
                    setForm={(form) => {this.form = form}}
                    />
                </Modal>

            </Card>
            
        )
    }
}
