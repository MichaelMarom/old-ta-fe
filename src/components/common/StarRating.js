import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating }) => {
  const totalStars = 5;

  const stars = Array.from({ length: totalStars }, (_, index) => {
    const isFilled = index < rating;

    if (isFilled) {
      return <FaStar key={index} color="gold" />;
    } else {
      return <FaRegStar key={index} color="gray" />;
    }
  });

  return <div>{stars}</div>;
};

export default StarRating;
