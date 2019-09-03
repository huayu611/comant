import { PureComponent } from "react";
import ReactQuill,{Quill} from 'react-quill';
import "./quill.easy.css";

const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': [] }],
        ['bold'],
        ['italic'],
        [{ 'background': [] }],
        [{ 'color': [] }],
        ['underline'],
        ['strike'],
        ['blockquote'],
        [{ 'list': 'ordered' }],
        [{ 'list': 'bullet' }],
        [{ 'indent': '-1' }],
        [{ 'indent': '+1' }],
        ['link'],
        ['image'],
        ['video'],
        ['clean'],

    ],
}
const formats = [
    'header',
    'bold', 'italic', 'background', 'color', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'image',
    'link', 'video', 'font', 'size',
]
export default class TextQuill extends PureComponent {
   
    handleChange = (value, value2, value3, value4) => {
        const {onChange,onTextChange} = this.props;
        if(!!onChange)
        {
            onChange(value);
        }
        if(!!onTextChange)
        {
            onTextChange(value4.getText());
        }
     
    };
    render() {
        const {value} = this.props;
        return (
            <ReactQuill style={{ height: "550px",marginBottom:'50' }}
                onChange={this.handleChange}
                modules={modules}
                 theme="snow"
                formats={formats}
                value={value || ""}
            />
        );
    }
}