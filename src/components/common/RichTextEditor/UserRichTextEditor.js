import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import './styles.css'

const UserRichTextEditor = ({ value, onChange, readOnly, placeholder, height = '92vh', ...rest }) => {
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'blockquote'],
            [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'blockquote',
        'list', 'bullet', 'indent',
        'link',
        'align',
    ];

    return (
        <div className="text-editor">
            <ReactQuill
                theme="snow"
                modules={modules}
                formats={formats}
                value={value}
                placeholder={placeholder}
                disabled={readOnly}
                style={{ height, backgroundColor: readOnly ? "#e9ecef" : "", }}
                onChange={(value) => onChange(value)}
                readOnly={readOnly}
                {...rest}
            />
        </div>
    );
};

export default UserRichTextEditor;

