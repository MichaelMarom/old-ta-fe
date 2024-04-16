import React, { useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module-react';
// import ImageDropAndPaste from 'quill-image-drop-and-paste'
import 'react-quill/dist/quill.snow.css';

import './styles.css'

Quill.register('modules/imageResize', ImageResize);
// Quill.register('modules/imageDropAndPaste', ImageDropAndPaste)

const RichTextEditor = ({ value, onChange, readOnly, placeholder, height = '92vh', ...rest }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      [{ 'color': [] }],
      ['clean']
    ],
    imageResize: {
      parchment: Quill.import('parchment'),
      modules: ['Resize', 'DisplaySize']
    },
    // imageDropAndPaste: {
    //   // add an custom image handler
    //   handler: image,
    // },
  };

  useEffect(() => {
    window.Quill = Quill
  }, [])

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image',
    'color',
    'size',
    'align',
  ];

  return (
    <div className="text-editor"
      style={{ background: readOnly ? "#e9ecef" : "" }}
    >
      <ReactQuill
        theme="snow"
        modules={modules}
        formats={formats}
        value={value}
        placeholder={placeholder}
        disabled={readOnly}
        style={{ height, background: readOnly ? "#e9ecef" : "" }}
        onChange={(value) => onChange(value)}
        readOnly={readOnly}
        {...rest}
      />
    </div>
  );
};

export default RichTextEditor;

