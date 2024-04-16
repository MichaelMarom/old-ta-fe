import React from 'react';
import { FaGrinStars, FaSmile, FaMeh, FaFrown, FaAngry } from 'react-icons/fa';
import Loading from '../../common/Loading';

const Questions = ({ loading, questions, handleEmojiClick }) => {

  if (loading)
    return <Loading height="40vh" />
  return (
    <div className="questions">
      {questions.map((question, index) => (
        <div className="question mb-4" key={index}>
          <p>{question.questionText}</p>
          <div className="emojis d-flex gap-4">
            <FaGrinStars
              size={30}
              color="rgb(217 196 166)"
              className={`mr-3 cursor-pointer best ${question.star === 5 ? ' text-success' : ''}`}
              onClick={() => handleEmojiClick(question.SID, 5)}
            />
            <FaSmile
              color={` ${question.star === 4 ? ' lightGreen' : 'rgb(217 196 166)'}`}
              size={30}
              className={`mr-3 cursor-pointer good `}
              onClick={() => handleEmojiClick(question.SID, 4)}
            />
            <FaMeh
              color={` ${question.star === 3 ? ' yellow' : 'rgb(217 196 166)'}`}
              size={30}
              className={`mr-3 cursor-pointer neutral `}
              onClick={() => handleEmojiClick(question.SID, 3)}
            />
            <FaFrown
              color={` ${question.star === 2 ? ' orange' : 'rgb(217 196 166)'}`}
              size={30}
              className={`mr-3 cursor-pointer angry `}
              onClick={() => handleEmojiClick(question.SID, 2)}
            />
            <FaAngry
              color="rgb(217 196 166)"
              size={30}
              className={`mr-3 cursor-pointer worst ${question.star === 1 ? ' text-danger' : ''}`}
              onClick={() => handleEmojiClick(question.SID, 1)}
            />
          </div>

        </div>
      ))}
    </div>
  );
};

export default Questions;
