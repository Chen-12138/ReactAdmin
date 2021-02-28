import React from 'react'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { reqDeleteImg } from '../../api'
import { BASE_IMG_URL } from '../../utils/constants'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: [
     /*  {
        uid: '-1', //每个file都有自己唯一的id
        name: 'image.png', //图片文件名
        status: 'done',  //图片状态
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      } */

    ],
  };

  constructor (props) {
      super(props)
    
    let fileList = []

    //   如果传入了imgs属性
    const {imgs} = props
    if(imgs && imgs.length>0){
        fileList = imgs.map((img,index) => ({
            uid: -index, //每个file都有自己唯一的id
            name: img, //图片文件名
            status: 'done',  //图片状态
            url: BASE_IMG_URL + img
        }))
    }

      //初始化状态
      this.state = {
        previewVisible: false,
        previewImage: '',
        fileList //所有已上传图片的数组
      }
  }

  /* 
  获取所有已上传图片文件名的数组
  */
 getImgs = () => {
     return this.state.fileList.map(file => file.name)
 }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  /* 
  file: 当前操作的图片文件(上传/删除)
  fileList: 所有已上传图片文件对象的数组    
  */
  handleChange = async ({ file,fileList }) => {
       this.setState({ fileList })

        // 一旦上传成功，将当前上传的file的信息修正(name,url)
        if(file.status==='done'){
            const res = file.response
            if(res.status===0){
                message.success('上传图片成功!')
                const {name,url} = res.data
                file = fileList[fileList.length-1]
                file.name = name
                file.url = url
            } else {
                message.error('上传图片失败')
            }
        } else if(file.status==='removed'){
            const res = await reqDeleteImg(file.name)
            if(res.status===0){
                message.success('删除图片成功！')
            } else{
                message.error('删除图片失败！')
            }
        }
    };

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <Upload
          action="/manage/img/upload" /* 上传图片的接口地址 */
          accept='image/*' /* 只接受图片格式 */
          name="image" /* 请求参数名 */
          listType="picture-card" /* 卡片样式 */
          fileList={fileList}   /* 所有已上传图片文件对象的数组 */
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}
