import React, { useState } from 'react';

const HtmlFilePreview = ({ onFileSelect }) => {
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/html') {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        setFileContent(content);
        onFileSelect(content); // Pass file content to the parent component
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid HTML file.');
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".html"
        onChange={handleFileChange}
      />
      {fileContent && (
        <div>
          <h5>Preview of {fileName}:</h5>
          <div
            style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}
            dangerouslySetInnerHTML={{ __html: fileContent }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default HtmlFilePreview;
