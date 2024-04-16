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
  //   const handleUpload = async () => {
  //     try {
  //       const formData = new FormData();
  //       formData.append('resume', file);

  //       // Use Axios for the file upload
  //       const response = await axios.post('http://localhost:3001/upload', formData, {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       });

  //       if (response.data.success) {
  //         console.log('File uploaded successfully');
  //       } else {
  //         console.error('File upload failed');
  //       }
  //     } catch (error) {
  //       console.error('Error uploading file:', error.message);
  //     }
  //   };

  return (
    <div>
      <input type="file" onChange={handleFileChange} name='resume' />
      <button >Upload</button>
    </div>
  );
};

export default FileUpload;
