import React, { useState } from 'react';
import CenteredModal from '../../../components/common/Modal';

const HtmlFilePreview = ({ onFileSelect, fileContent }) => {
  const [fileName, setFileName] = useState('');
  const [seeFileContent, setSeeFileContent] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/html') {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
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
          <button className='btn btn-warning' type='button' onClick={()=>setSeeFileContent(true)}>See File Preview</button>
          <CenteredModal title={"Email Preview"} minWidth='800px' style={{maxWidth:"800px"}} show={seeFileContent} handleClose={()=>setSeeFileContent(false)}          >
            <div className='email-temp-preview' >
              <div style={{ overflowY: 'auto'}}
                dangerouslySetInnerHTML={{ __html: fileContent }} />
            </div>

          </CenteredModal>
        </div>
      )}
    </div>
  );
};

export default HtmlFilePreview;
