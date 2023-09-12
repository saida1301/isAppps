import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import axios from 'axios';

const renderFilledStars = (averageRating: number) => {
  const filledStars = [];
  const maxRating = Math.min(averageRating, 5); // Limit to a maximum of 5 stars

  for (let i = 1; i <= 5; i++) {
    const starImage =
      i <= maxRating ? (
        <Image
          key={i}
          source={require('AwesomeProject/src/assets/images/filled-star.webp')}
          style={{ width: 20, height: 20 }}
        />
      ) : (
        <Image
          key={i}
          source={require('AwesomeProject/src/assets/images/not-filled-star.webp')}
          style={{ width: 20, height: 20}}
        />
      );

    filledStars.push(starImage);
  }

  return filledStars;
};

const ComponentStar = ({ company_id }: any) => {
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    // Fetch the average rating for the company using Axios.
    axios.get(`https://movieappi.onrender.com/average-rating/${company_id}`)
      .then((response) => {
        const { averageRating } = response.data;
        setAverageRating(averageRating);
      })
      .catch((error) => {
        console.error("Error fetching average rating:", error);
      });
  }, [company_id]);

  return (
    <View style={{ flexDirection: 'row' }}>
      {renderFilledStars(averageRating)}
    </View>
  );
};

export default ComponentStar;