import { Upload, Icon, Modal } from 'antd';
import { PureComponent } from 'react';
import { getMangerToken, getVersion } from '../utils';

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

const uploadProp = {
    action: "/eframe/multipart-manager/upload/product-image",
    headers: {
        "Authorization": "Bearer " + getMangerToken(),
        "EVersion": getVersion(),
    },
};

export default class PicturesWall extends PureComponent {

    static defaultProps = {
        length: 10
    };


    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [

        ],
        renderImage: false,
    };

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    shouldComponentUpdate(nextProps, nextState) {
        const imageNext = nextState.fileList;
        const imageNow = this.state.fileList;
        if(imageNext.length>0 && imageNow.length>0)
        {
            if (Array.isArray(imageNow)&&!imageNow[imageNow.length - 1].url && !!imageNext[imageNext.length - 1].url) {
                return true;
            }
        }
      
        return true;
    }


    handleChange = (info) => {
        let file = info.file;
        let fileList = info.fileList;
        let lastUrl = '';
        const { onChange } = this.props;

        if (file.status === 'done') {
            if (file.response) {
                if (file.response.code === "0") {

                    let name = file.response.data.fullPath;
                    fileList.splice(fileList.length - 1, 1);
                    let newItem = {
                        uid: file.response.data.name,
                        name: file.response.data.name,
                        status: 'done',
                        url: file.response.data.httpPath,
                    }
                    fileList.push(newItem);

                }
            }


        }
        // console.log(fileList)
        if (!!onChange) {
            onChange(fileList)
        }
        this.setState({ fileList });
    }




    static getDerivedStateFromProps(nextProps, prevState) {
        if (!!prevState.renderImage) {
            return { renderImage: true }
        }
        const { images } = nextProps;
        let fileList = [];
        if (Array.isArray(images)) {
            images.forEach((item, index) => {
                let param = {
                    uid: index,
                    name: item,
                    status: 'done',
                    url: item,
                }
                fileList.push(param);
            })

        }
        return { fileList: fileList, renderImage: true }
    }



    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const { length } = this.props;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );


        return (
            <div className="clearfix">
                <Upload
                    listType="picture-card"
                    fileList={fileList}
                    {...uploadProp}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= length ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

