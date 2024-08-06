import React from "react";
import { FaGrinStars, FaSmile, FaMeh, FaFrown, FaAngry } from "react-icons/fa";
import Loading from "../../common/Loading";

const Questions = ({ loading, questions, handleEmojiClick }) => {

  if (loading) return <Loading height="40vh" smallerIcon iconSize={50} />;
  return (
    <div className="questions">
      {questions.map((question, index) => (
        <div className="question mb-4" key={index}>
          <p style={{fontSize:"12px", fontWeight:"400", color:"gray"}}>{question.questionText}</p>
          <div className="emojis d-flex gap-2 m-2">
            <FaGrinStars
              size={20}
              // color="rgb(217 196 166)"
              className={`mr-3 cursor-pointer emoji ${
                question.star === 5 ? "best-active" : "best"
              }`}
              onClick={() => handleEmojiClick(question.SID, 5)}
            />
            <FaSmile
              // color={` ${question.star === 4 ? ' lightGreen' : 'rgb(217 196 166)'}`}
              size={20}
              className={`mr-3 cursor-pointer emoji ${
                question.star === 4 ? " good-active" : "good"
              } `}
              onClick={() => handleEmojiClick(question.SID, 4)}
            />
            <FaMeh
              // color={` ${question.star === 3 ? ' yellow' : 'rgb(217 196 166)'}`}
              size={20}
              className={`mr-3 cursor-pointer emoji ${
                question.star === 3 ? " neutral-active" : "neutral"
              } `}
              onClick={() => handleEmojiClick(question.SID, 3)}
            />
            <FaFrown
              // color={` ${question.star === 2 ? ' orange' : 'rgb(217 196 166)'}`}
              size={20}
              className={`mr-3 cursor-pointer emoji  ${
                question.star === 2 ? "angry-active" : "angry"
              }`}
              onClick={() => handleEmojiClick(question.SID, 2)}
            />
            <FaAngry
              // color="rgb(217 196 166)"
              size={20}
              className={`mr-3 cursor-pointer emoji  ${
                question.star === 1 ? " worst-active" : "worst"
              }`}
              onClick={() => handleEmojiClick(question.SID, 1)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Questions;
