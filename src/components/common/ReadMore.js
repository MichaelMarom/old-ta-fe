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

  // Check if the content is text or HTML
  const renderContent = () => {
    if (isHtml) {
      // If it's HTML, use `dangerouslySetInnerHTML` to render HTML content
      return isExpanded ? (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: getTruncatedText(content) }} />
      );
    }

    // If it's plain text, render it with truncation
    const truncatedText = getTruncatedText(content);
    return isExpanded ? content : truncatedText;
  };

  return (
    <div>
      <p>
        {renderContent()}
        {content.length > maxLength && (
          <span
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ color: 'blue', cursor: 'pointer', marginLeft: '5px' }}
          >
            {isExpanded ? 'Read less' : 'Read more'}
          </span>
        )}
      </p>
    </div>
  );
};

export default ReadMore;
