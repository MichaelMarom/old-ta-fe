import React, { useEffect, useRef } from 'react';
import Loading from '../common/Loading';
import MessageBox from './MessageBox';
import NoMessage from './NoMessage';

function Messages({ messages, fetchingMessages }) {
  const messagesContainer = useRef(null);

  useEffect(() => {
    if (messagesContainer.current) {
      messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight;
    }
  }, [messages])

  if (fetchingMessages)
    return <Loading height='100%' />
  return (
    <div className="ks-body ks-scrollable jspScrollable" data-auto-height="" data-reduce-height=".ks-footer" data-fix-height="32"
      style={{ height: '480px', overflowY: 'auto', padding: '0px', width: '100%' }} tabIndex="0" ref={messagesContainer}>
      <div className="jspContainer" style={{ width: '100%', height: '481px' }}>
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
    </div>
  );
}

export default Messages;
