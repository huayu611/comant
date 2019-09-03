import React, { PureComponent, Fragment } from "react";
import { Avatar, Upload, Button, Dropdown, Menu, Icon, Input, Tooltip } from 'antd';
import PropTypes from 'prop-types';
const Search = Input.Search;
export default class ImageUpload extends PureComponent {
    state = {
        image: "",
        type: 'upload',
        selectedImage:"1"
    }
    static propTypes = {
    };
    static defaultProps = {
        buttonName: '确定',
        label: ''
    };
    setType = (type) => {
        this.setState({ type: type });
    }
    uploadFilter = (info) => {
        const { onChange } = this.props;
        let file = info.file;
        let resultPath;
        let httpPath;
        let name;
        if (file.response) {
            if (file.response.code === "0") {

                name = file.response.data.name;
                httpPath = file.response.data.httpPath;
            }
        }
        if (onChange) {
            onChange(httpPath, name);
        }
    }
    uploadOnLineImage = (value) => {
        const { onChange } = this.props;
        if (onChange) {
            onChange(value);
        }

    }

    enter = () =>{
        this.setState({selectedImage:'2'});
    }
    leave = () =>{
        this.setState({selectedImage:'1'});
    }
    render() {
        const { buttonName, onChange, value, uploadProp, label } = this.props;
        const uploadButton = (
            <div style={{background:"#eeeeee",padding:"20px 20px 20px 20px",margin:'10px 10px 10px 10px',cursor:'pointer'}}>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        let uprop = {
            action: uploadProp.action,
            headers: {
                "Authorization": uploadProp.authorization,
                "EVersion": uploadProp.version,
            },
        }
        return (
            <div style={{textAlign:'center'}}>
                <div>
                    {label}
                </div>
                {this.state.type === 'upload' ?

                    <div>
                        <div style={{ textAlign:'center'}}>
                            <Tooltip title="点击选择本地图片">
                                <Upload
                                    listType="text"
                                    style={{background:'#eeeeee',padding:'20 20 20 20',cursor:'pointer'}}
                                    onChange={this.uploadFilter}
                                    showUploadList={false}  {...uprop} >
                                    {value && value !== "" ? <Avatar      
                                    onMouseEnter={this.enter}
                                    onMouseLeave={this.leave}
                                className={this.state.selectedImage === "2" && "upload-img-cust"} src={value} size={140} shape="square" /> : uploadButton}
                                </Upload>
                            </Tooltip>
                        </div>
                        <div style={{ marginBottom: '10px', textAlign: 'center',marginTop:'10px' }}>
                            <Button onClick={() => this.setType('online')}>上传在线图片</Button>
                        </div>
                    </div>
                    :
                    <Fragment>
                        <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                            <Avatar src={value} size={140} shape="square" />
                        </div>
                        <div style={{ marginBottom: '10px', textAlign: 'center',marginTop:'10px' }}>
                            <Search
                                placeholder="图片URL: https://"
                                enterButton={buttonName}
                                style={{ width: '280px' }}
                                onSearch={valueSearch => this.uploadOnLineImage(valueSearch)}
                            />
                        </div>
                        <div>
                            <Button onClick={() => this.setType('upload')}>上传本地图片</Button>
                        </div>
                    </Fragment>
                }
            </div>
        );
    }
}