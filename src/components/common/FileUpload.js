import React, { useState } from 'react';
import { FaPlus, FaUpload } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    return (
        <div className='border shadow p-2 m-2 h-100 '>
            <form className='h-auto p-2'>
                <label htmlFor='file-upload' className='border  d-flex justify-content-center align-items-center' style={{ height: "100px", gap: "10px" }}>
                    <div className='rounded-circle border shadow  d-flex justify-content-center align-items-center click-effect-elem'
                        style={{ width: "30px", height: "30px", }}>
                        <FaUpload color='rgb(68 91 215)' />
                    </div>
                    <div>
                        Upload Image/File Here</div>

                </label>
                <input type="file" id="file-upload" className='d-none' onChange={handleFileChange} />
            </form>
            {previewUrl && (
                <div>
                    {file && file.type.startsWith('image/') ? (
                        <div className='position-relative ' style={{width:"fit-content"}}>
                            <img src={previewUrl} className='border shadow rounded' alt="Preview" style={{ width: '70px', height: 'auto' }} />
                            <MdCancel color="orange" size={20} style={{ position: "absolute",right:"-8px" ,top:"-8px",  }} />
                        </div>
                    ) : (
                        <a href={previewUrl} target="_blank" rel="noopener noreferrer">View File</a>
                    )}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
