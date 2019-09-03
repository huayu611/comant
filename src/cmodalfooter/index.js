import { PureComponent, Fragment } from "react";
import { Button } from 'antd';

export default class ModalFooter extends PureComponent {



    renderOnlyOk = () => {
        const { okText = '确定', onOk } = this.props;
        return (
            <Button key="forward" type="primary" onClick={onOk}>
                {okText}
            </Button>
        )
    }

    renderOnlyCancel = () => {
        const { cancelText = '取消', onCancel } = this.props;
        return (
            <Button key="cancel" onClick={onCancel}>
                {cancelText}
          </Button>
        )
    }

    renderOkAndCacnel = () => {
        const { onOk, cancelText = '取消', okText = '确定',onCancel } = this.props;

        return [
            <Fragment>
                <Button key="cancel" onClick={onCancel}>
                    {cancelText}
                </Button>
                <Button key="forward" type="primary" onClick={onOk}>
                    {okText}
                </Button>
            </Fragment>
        ];
    }
    render() {
        const { type } = this.props;
        switch (type) {
            case 'ok':
                {
                    return this.renderOnlyOk();
                }
            case 'cancel':
                {
                    return this.renderOnlyCancel();

                }
            case 'okcancel':
                {
                    return this.renderOkAndCacnel();
                }
            default:
                {
                    void (0)
                }

        }
    }
}