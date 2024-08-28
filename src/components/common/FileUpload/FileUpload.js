import React, { useState } from 'react';
import { uploadFile } from '../../../axios/tutor';

const FileUpload = () => {
  const [file, setFile] = useState(null);


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    // Call the upload function here with the selectedFile
    uploadFile(selectedFile)
      .then((response) => {
        console.log('File uploaded successfully:', response);
      })
      .catch((error) => {
        console.error('File upload failed:', error);
      });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} name='resume' />
      <button >Upload</button>
    </div>
  );
};

export default FileUpload;
