import React, { useState } from 'react';

const ReadMore = ({ content, maxLength = 100, isHtml = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to truncate the content (if it's text)
  const getTruncatedText = (text) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  const renderContent = () => {
    if (isHtml) {
      return isExpanded ? (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: getTruncatedText(content) }} />
      );
    }

    const truncatedText = getTruncatedText(content);
    return isExpanded ? content : truncatedText;
  };

  return (
    <div>
      <div>
        {renderContent()}
        {content.length > maxLength && (
          <span
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ color: 'blue', cursor: 'pointer', marginLeft: '5px' }}
          >
            {isExpanded ? 'Read less' : 'Read more'}
          </span>
        )}
      </div>
    </div>
  );
};

export default ReadMore;
