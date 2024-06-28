import React, { useEffect, useRef } from 'react';
import Loading from '../common/Loading';
import MessageBox from './MessageBox';
import NoMessage from './NoMessage';
import { showDate } from '../../utils/moment';
import { wholeDateFormat } from '../../constants/constants';

function Messages({ messages, fetchingMessages, files }) {
  const messagesContainer = useRef(null);
  const fileAboutToSend = useRef(null)

  useEffect(() => {
    if (messagesContainer.current) {
      messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight;
    }
  }, [messages, files.images, files.pdfs])

  useEffect(() => {
    if (!!files.images.length || !!files.pdfs.length)
      fileAboutToSend.current && fileAboutToSend.current.classList.add('open')
    else{
      fileAboutToSend.current && fileAboutToSend.current.classList.remove('open')
    }
  }, [files.images, files.pdfs])

  if (fetchingMessages)
    return <Loading height='100%' />
  return (
    <div className="ks-body ks-scrollable jspScrollable position-relative" data-auto-height="" data-reduce-height=".ks-footer" data-fix-height="32"
      style={{ height: '480px', overflowY: 'auto', padding: '0px', width: '100%' }} tabIndex="0" ref={messagesContainer}>
      <div className="jspContainer" style={{ width: '100%', height: 'fit-content' }}>
        <div className="jspPane" style={{ padding: '0px', top: '0px', width: '100%' }}>
          <ul className="ks-items d-flex flex-column">
            {
              !messages.length ? <NoMessage /> :
                messages.map((message) => (
                  <MessageBox message={message} key={message.id} />
                ))}
          </ul>
        </div>
      </div>
      <div className='position-absolute border shadow rounded fileAboutToSend d-flex flex-column'
        style={{ right: "5px", gap: "10px" }} ref={fileAboutToSend}>
        {files.images.map((image, index) => (
          <div className='border border-secondary p-2 rounded' key={index}>
            <div>{image.name}</div>
            <div className='w-100 text-right' style={{ fontSize: '12px', color: 'gray', fontWeight: '500' }}>
              {showDate(new Date(), wholeDateFormat)}
            </div>
            <div className='mt-2'>
              <img
                src={URL.createObjectURL(image)}
                alt={image.name}
                width={100} height={100}
                style={{ maxWidth: '100px', maxHeight: '100px' }}
              />
            </div>
          </div>
        ))}

        {files.pdfs.map((pdf, index) => (
          <div className='border border-secondary p-2 rounded'>
            <div>{pdf.name}</div>
            <div className='w-100 text-right' style={{ fontSize: '12px', color: 'gray', fontWeight: '500' }}>
              {showDate(new Date(), wholeDateFormat)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Messages;
