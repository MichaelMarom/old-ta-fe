import React, { useState } from 'react';
import { PiPaperclipFill } from "react-icons/pi";
import SendFileModal from './SendFileModal';


function SendMessage({ sendMessage, setFiles, files }) {
  const [text, setText] = useState('');
  const [sendingFilesOpen, setSendingFilesOpen] = useState(false)
  const [clickedOption, setClickedOption] = useState(null)
  // const [files, setFiles] = useState({ images: [], pdfs: [] });

  const handleSendMessage = (e) => {
    e.preventDefault();
    setText('');
    sendMessage(text, files.images.length || files.pdfs.length ? 'file' : 'text', files)
    setFiles({ images: [], pdfs: [] })
  }

  const FileSendingOpeions = [
    { label: "Send PDF", id: "sendPdf", accept: "application/pdf", type: "pdfs" },
    { label: "Send Image", id: "sendImage", accept: "image/*", type: "images" },
  ]

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    setSendingFilesOpen(false)
    if (file) {
      setFiles((prevFiles) => ({
        ...prevFiles,
        [type]: [...prevFiles[type], file],
      }));
    }
  };

  return (
    <div className="input-group border-top ">
      <div className='border position-relative'>
        <PiPaperclipFill size={38} color='' onClick={() => setSendingFilesOpen(!sendingFilesOpen)} />
        {sendingFilesOpen && <div className='position-absolute border p-2 rounded text-bg-warning'
         style={{ bottom: "45px", left: "-20px", whiteSpace: "nowrap" }}>
          <svg width="1em" height="1em" viewBox="0 0 16 16" class="position-absolute top-100 start-50 translate-middle mt-1"
           fill="var(--bs-warning)" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" /></svg>
          {FileSendingOpeions.map((item, index) => <div onClick={() => setClickedOption(item.id)}>
            <div>
              <label
                htmlFor={item.id}
                style={{ fontSize: "12px", cursor: "pointer" }}
              >{item.label}
              </label>
              <input type="file" id={item.id} className='d-none' accept={item.accept} onChange={(e) => handleFileChange(e, item.type)} />
            </div>
          </div>)}
        </div>}
      </div>
      <input type="text" className="form-control m-0 border-0" placeholder="Type Message...."
        onChange={(e) => setText(e.target.value)} value={text} />
      <button className="btn btn-outline-success m-0" type="button"
        onClick={handleSendMessage}>Send</button>

    </div>
  );
}

export default SendMessage;
