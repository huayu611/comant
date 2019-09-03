import { PureComponent } from 'react'
import { Modal } from 'antd';

class ImageView extends PureComponent {




    render() {
        const{visible,src,close,size} = this.props;
        return (
            <Modal width={size} visible={visible} footer={null}  onCancel={() =>close()}>
                <img  style={{ width: '100%' }} src={src} />
            </Modal>
        )
    }
}

export default ImageView;