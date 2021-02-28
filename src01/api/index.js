/* 
包含应用中所有接口请求函数的模块
每个函数的返回值都是promise
*/
import ajax from './ajax'
import jsonp from 'jsonp'

// const BASE = 'http://localhost:5000'
const BASE = ''

// 登录
// export function reqLogin(username,password) {
//     return ajax('/login', {username,password}, 'POST')
// }

export const reqLogin = (username,password) => ajax(BASE+'/login', {username,password}, 'POST')

// 获取一级/二级分类的列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', {parentId})

// 添加分类
export const reqAddCategory = (parentId,categoryName) => ajax(BASE + '/manage/category/add', {parentId,categoryName}, 'POST')

// 更新分类
export const reqUpdateCategory = (categoryId,categoryName) => ajax(BASE + '/manage/category/update', {categoryId,categoryName}, 'POST')

// 获取商品分页列表
export const reqProducts = (pageNum,pageSize) => ajax(BASE + '/manage/product/list',{pageNum,pageSize})

// 搜索商品分页列表
export const reqSearchProducts = ({pageNum,pageSize,searchName,searchType}) => ajax(BASE + '/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchName
})

// 更新商品的状态
export const reqUpdateStatus = (productId,status) => ajax(BASE + '/manage/product/updateStatus', {productId,status}, 'POST')

// 获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId})

// 删除图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', {name}, "POST")

// 添加商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + (product._id ? 'update' : 'add'), {product}, 'POST')

// 获取所有角色的列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')

// 添加角色的列表
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', {roleName}, 'POST')

//更新角色
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST')

// 获取所有用户的列表
export const reqUsers = () => ajax(BASE + '/manage/user/list')

// 删除指定用户
export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete', {userId}, 'POST')

// 添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/'+(user._id ? 'update' : 'add'), user, 'POST')
/* 
jsonp请求的接口请求函数
*/
// export const reqWeather = (city) => {
//     const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
//     jsonp(url, {}, (err,data)=>{
//         console.log('jsonp',err,data)
//     })
// }
// reqWeather('北京')