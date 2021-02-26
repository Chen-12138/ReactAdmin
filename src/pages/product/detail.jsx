import React, { Component } from 'react'

import { ArrowLeftOutlined } from '@ant-design/icons'

import LinkButton from '../../components/link-button'
import {BASE_IMG_URL} from '../../utils/constants'
import {reqCategory} from '../../api'

import {
    Card,
    List
} from 'antd'

const Item = List.Item

export default class ProductDetail extends Component {

    state = {
        cName1: '', //一级分类名称
        cName2: ''  //二级分类名称
    }

    async componentDidMount(){
        const {pCategoryId, categoryId} = this.props.location.state.product
        if (pCategoryId==='0') {
            const res =  await reqCategory(categoryId)
            const cName1 = res.data.name
            this.setState({cName1})
        } else {
            /* const res1 =  await reqCategory(pCategoryId)
            const res2 =  await reqCategory(categoryId)
            const cName1 = res1.data.name
            const cName2 = res2.data.name */

            // 一次性发送多个请求，只有都成功了，才正常处理
            const results = await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)])

            const cName1 =  results[0].data.name
            const cName2 =  results[1].data.name

            this.setState({
                cName1,
                cName2
            })
        }
    }

    render() { 

        // 读取携带过来的state数据
        const {name,desc,price,detail,imgs} = this.props.location.state.product
        const {cName1,cName2} = this.state

        const title = (
            <span>
                <LinkButton>
                    <ArrowLeftOutlined style={{marginRight:1,fontSize:17}}
                    onClick={()=>{this.props.history.goBack()}}
                    />
                </LinkButton>
                <span>商品详情</span>
            </span>
        )
        return (
            <Card title={title} className='product-detail'>
                <List>
                    <Item>
                        <span className='left'>商品名称：</span>
                        <span>{name}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品描述：</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品价格：</span>
                        <span>{price}</span>
                    </Item>
                    <Item>
                        <span className='left'>所属分类：</span>
                        <span>{cName1} {cName2 ? '-->'+cName2 : ''}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品图片：</span>
                        <span>
                            {
                                imgs.map(img => (
                                    <img 
                                    src={BASE_IMG_URL + img} 
                                    alt="img" 
                                    className="product-img"
                                    key={img}
                                    />
                                ))
                            }
                        </span>
                    </Item>
                    <Item>
                        <span>商品详情</span>
                        <span dangerouslySetInnerHTML={{__html:detail}}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}
