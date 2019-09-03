import { PureComponent } from "react";
import { Result, Button,Divider } from 'antd';
import { withRouter } from 'react-router-dom';
import 'antd/es/result/style'
class NotFound404Page extends PureComponent {


    goback = (backPath = "/") => {
        const {  history } = this.props;
        history.push(backPath);
    }
    render() {
        return (
            <Result
                status="404"
                title="404"
                subTitle="页面不存在！"
                extra={<React.Fragment><Button onClick={() => this.goback("/")} type="primary">返回首页</Button>
                <Divider type="vertical" />
                    <Button onClick={() => this.goback("/web/manager/center/information/view")} type="primary">返回个人主页</Button></React.Fragment>}
                />
            )
        }
    }
    
export default withRouter(NotFound404Page);