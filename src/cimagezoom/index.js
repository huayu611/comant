import { PureComponent } from "react";

import ImageZoom from 'react-medium-image-zoom'

class ImageZoomView extends PureComponent {
    render() {
        const {src,className,style} = this.props;
        return (
            <ImageZoom 
                image={{
                    src: src,
                }}
                zoomImage={{
                    src: src,
                }}
            />
        )
    }
}
export default ImageZoomView